import { GoogleGenAI, Type } from "@google/genai";
import { FlightDetails, FlightInputData, GroundingSource, JetLagPlan, UserPreferences } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const searchFlightInfo = async (
  inputs: FlightInputData[],
  signal?: AbortSignal
): Promise<{ flights: FlightDetails[]; sources: GroundingSource[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const prompt = `
    Find the official scheduled departure and arrival times for these flights.
    
    Itinerary Sequence:
    ${inputs.map((i, idx) => `
      ${idx + 1}. Flight: ${i.flightNumber}
         Date: ${i.date ? i.date : 'Not specified (Infer from previous arrival)'}
    `).join('\n')}

    Instruction:
    - If a specific date is provided for a flight, use it.
    - If a date is NOT provided for a stopover flight, infer it based on the arrival time of the previous flight (allowing for reasonable layover time).
    - Verify using a reliable flight data source (e.g. FlightAware, Google Flights).

    Return a JSON object with a "flights" array. 
    Each object must contain:
    - id: (Use '${inputs[0]?.id}' for first, etc.)
    - flightNumber
    - origin: (City and Airport Code)
    - destination: (City and Airport Code)
    - departureTime: (Local ISO 8601 e.g. 2023-10-27T14:30:00)
    - arrivalTime: (Local ISO 8601)
    - airline
    - duration

    Ensure the times are LOCAL times.
  `;

  try {
    // Check signal before API call
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    // Check signal after API call
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const sources: GroundingSource[] = [];
    
    // Extract grounding chunks
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            url: chunk.web.uri,
          });
        }
      });
    }

    const text = response.text || "{}";
    const data = JSON.parse(text);

    // Map IDs back to the results if the LLM didn't return them perfectly or if we need to ensure stability
    const mappedFlights = (data.flights || []).map((f: any, index: number) => ({
      ...f,
      id: inputs[index] ? inputs[index].id : Math.random().toString() 
    }));

    return {
      flights: mappedFlights,
      sources,
    };

  } catch (error: any) {
    if (error.name === 'AbortError' || signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    console.error("Error searching flight info:", error);
    throw new Error("Failed to retrieve flight information. Please check your flight number and try again.");
  }
};

export const generateJetLagPlan = async (
  flights: FlightDetails[],
  preferences: UserPreferences,
  signal?: AbortSignal
): Promise<JetLagPlan> => {
  
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const flightSummary = flights.map(f => 
    `${f.airline} ${f.flightNumber} from ${f.origin} (${f.departureTime}) to ${f.destination} (${f.arrivalTime})`
  ).join('; then ');

  const prompt = `
    Act as a chronobiology expert. Create a Jet Lag Mitigation Plan.
    
    Trip: ${flightSummary}
    
    Bio-Profile & Preferences:
    - Age Group: ${preferences.ageGroup}
    - Chronotype: ${preferences.chronotype}
    - Caffeine: ${preferences.caffeine}
    - Alcohol: ${preferences.alcohol}
    - Melatonin: ${preferences.melatonin}
    - Light Sensitivity: ${preferences.lightSensitivity}

    Strictly apply these LOGIC ENGINE RULES based on the bio-profile:
    
    1. AGE (${preferences.ageGroup}): 
       - If user is 50-70 or 70+, slow down the "Phase Advance" (Eastbound) transition. Older bodies adapt more slowly; provide gentler, shorter light-seeking windows.

    2. CHRONOTYPE (${preferences.chronotype}): 
       - If 'night_owl': Shift the entire schedule (sleep/wake/light) +90 minutes later than standard.
       - If 'early_bird': Shift the entire schedule -60 minutes earlier than standard.

    3. CAFFEINE (${preferences.caffeine}): 
       - If 'optimized': Insert a "Strategic Caffeine" event 30 minutes before the "Wake Up" phase or 2 hours before landing. 
       - If 'avoid': Replace any caffeine suggestions with "Herbal Hydration".

    4. ALCOHOL (${preferences.alcohol}): 
       - If 'relax': The event following alcohol consumption MUST be "Hydration Recovery (+500ml water)". Extend the subsequent "Core Sleep" block by 45 minutes to account for sleep fragmentation.

    5. MELATONIN (${preferences.melatonin}): 
       - If 'supplements': Insert a "Melatonin Intake" event 30 minutes prior to the "Core Sleep" phase (Pre, Flight, or Post-Flight recovery sleep). Add Melatonin to the 'recommendations' list.
       - If 'natural': Do NOT recommend Melatonin pills. Instead, insert "Sleep-Inducing Snack" events (e.g. Tart Cherry Juice, Magnesium-rich foods, Bananas) in the schedule before sleep. Add these items to the 'recommendations' list (Traveler's Toolkit).
    
    6. LIGHT SENSITIVITY (${preferences.lightSensitivity}): 
       - If 'high': Prioritize "Blue-Blocker Glasses" in the "Evening Wind Down" phase and suggest "Total Blackout Mask" for the "Core Sleep" phase in recommendations.

    7. TRANSITS (Stopovers):
       - If the user has a layover, create a specific event with type "TRANSIT".
       - If layover < 2 hours: Recommend "Brisk Walk" to terminal, hydration, and light snacking.
       - If layover > 2 hours: Recommend finding a quiet spot or lounge, perhaps a short nap if aligned with sleep window, or a longer walk. Avoid heavy duty-free shopping to reduce stress.
       - Suggest avoiding alcohol/coffee during short transits.

    General Tasks:
    1. Determine direction (East/West) and phase shift.
    2. Create a schedule (PRE, FLIGHT, POST phases). FLIGHT phase must be an HOUR-BY-HOUR plan.
    3. **Science Notes**: For each event, add a 'scienceNote' (max 2 sentences, simple tone) explaining the biology.
    4. **Toolkit Recommendations**: Populate 'recommendations' with gear based on the plan and strict logic above.

    Time Format: "HH:MM (Origin) / HH:MM (Dest)"
    
    Return JSON matching the schema.
  `;

  // Define schema for structured output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      direction: { type: Type.STRING, enum: ['EAST', 'WEST', 'NORTH_SOUTH'] },
      schedule: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING, description: "Display time. MUST be: 'HH:MM (Origin) / HH:MM (Dest)'" },
            type: { type: Type.STRING, enum: ['SLEEP', 'LIGHT', 'DARK', 'FOOD', 'CAFFEINE', 'ACTIVITY', 'FLIGHT', 'TRANSIT'] },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            scienceNote: { type: Type.STRING, description: "Simple 2-sentence explanation of the science." },
            phase: { type: Type.STRING, enum: ['PRE', 'FLIGHT', 'POST'] }
          }
        }
      },
      scienceLinks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            url: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  affiliatePlaceholder: { type: Type.BOOLEAN }
                }
              }
            }
          }
        }
      }
    }
  };

  try {
    // Check signal before API call
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    // Check signal after API call
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const text = response.text || "{}";
    return JSON.parse(text) as JetLagPlan;

  } catch (error: any) {
    if (error.name === 'AbortError' || signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    console.error("Error generating plan:", error);
    throw new Error("Failed to generate jet lag plan.");
  }
};
