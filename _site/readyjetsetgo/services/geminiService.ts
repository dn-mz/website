import { FlightDetails, FlightInputData, GroundingSource, JetLagPlan, UserPreferences } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export const searchFlightInfo = async (
  inputs: FlightInputData[],
  signal?: AbortSignal
): Promise<{ flights: FlightDetails[]; sources: GroundingSource[] }> => {
  
  // Abort check before we even start
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
    // We point to the local PHP file. Because it's in the same folder,
    // a relative path "./proxy.php" is best.
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        tools: [{ googleSearch: {} }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
      signal, // Passes the abort signal to the fetch request
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to reach the proxy server.");
    }

    const result = await response.json();

    // The REST API response structure differs slightly from the SDK.
    // We navigate: candidates -> content -> parts -> text
    const candidate = result.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "{}";
    const data = JSON.parse(text);

    const sources: GroundingSource[] = [];
    
    // Extract grounding sources from the new structure
    if (candidate?.groundingMetadata?.groundingChunks) {
      candidate.groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            url: chunk.web.uri,
          });
        }
      });
    }

    // Ensure we map IDs back for UI stability
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

    Apply the logic engine rules based on the bio-profile provided.
    
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

  `; // Keep your full prompt string here exactly as it was

  // Simplified Schema for REST API (No "Type.OBJECT" wrappers needed)
  const responseSchema = {
    type: "object",
    properties: {
      direction: { type: "string", enum: ['EAST', 'WEST', 'NORTH_SOUTH'] },
      schedule: {
        type: "array",
        items: {
          type: "object",
          properties: {
            time: { type: "string" },
            type: { type: "string", enum: ['SLEEP', 'LIGHT', 'DARK', 'FOOD', 'CAFFEINE', 'ACTIVITY', 'FLIGHT', 'TRANSIT'] },
            title: { type: "string" },
            description: { type: "string" },
            scienceNote: { type: "string" },
            phase: { type: "string", enum: ['PRE', 'FLIGHT', 'POST'] }
          }
        }
      },
      scienceLinks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            url: { type: "string" },
            description: { type: "string" }
          }
        }
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            category: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  affiliatePlaceholder: { type: "boolean" }
                }
              }
            }
          }
        }
      }
    }
  };

  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        }
      }),
      signal
    });

    if (!response.ok) {
      throw new Error("Failed to generate plan via proxy.");
    }

    const result = await response.json();
    
    // Drill down into the response structure
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(text) as JetLagPlan;

  } catch (error: any) {
    if (error.name === 'AbortError' || signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    console.error("Error generating plan:", error);
    throw new Error("Failed to generate jet lag plan.");
  }
};


