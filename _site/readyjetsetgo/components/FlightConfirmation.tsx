import React, { useState, useEffect } from 'react';
import { FlightDetails, GroundingSource } from '../types';
import { CheckCircle2, Edit2, ExternalLink, AlertTriangle } from 'lucide-react';

interface FlightConfirmationProps {
  flights: FlightDetails[];
  sources: GroundingSource[];
  onConfirm: (flights: FlightDetails[]) => void;
  onReset: () => void;
}

const FlightConfirmation: React.FC<FlightConfirmationProps> = ({ flights: initialFlights, sources, onConfirm, onReset }) => {
  const [flights, setFlights] = useState<FlightDetails[]>(initialFlights);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logicWarnings, setLogicWarnings] = useState<string[]>([]);

  // Function to extract Airport Code from string like "London (LHR)" -> "LHR"
  const getAirportCode = (str: string) => {
    const match = str.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const warnings: string[] = [];
    
    for (let i = 0; i < flights.length - 1; i++) {
      const current = flights[i];
      const next = flights[i + 1];
      const arrivalTime = new Date(current.arrivalTime);
      const departureTime = new Date(next.departureTime);

      // Check 1: Time Continuity
      if (departureTime < arrivalTime) {
        warnings.push(`Connection Issue: Flight ${next.flightNumber} departs before ${current.flightNumber} arrives.`);
      }

      // Check 2: Location Continuity (Fuzzy Check based on Airport Codes if available)
      const currentDestCode = getAirportCode(current.destination);
      const nextOriginCode = getAirportCode(next.origin);

      if (currentDestCode && nextOriginCode && currentDestCode !== nextOriginCode) {
         warnings.push(`Location Mismatch: Flight ${current.flightNumber} arrives in ${currentDestCode}, but Flight ${next.flightNumber} departs from ${nextOriginCode}.`);
      }
    }

    setLogicWarnings(warnings);
  }, [flights]);

  const handleUpdate = (id: string, field: keyof FlightDetails, value: string) => {
    setFlights(flights.map(f => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleSave = (id: string) => {
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Review Flight Details</h2>
          <button onClick={onReset} className="text-sm text-slate-500 hover:text-slate-800 underline">
            Start Over
          </button>
        </div>

        {flights.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm">
             I found your flight: <strong>{flights[0].origin}</strong> to <strong>{flights[0].destination}</strong>. 
             Departs at <strong>{new Date(flights[0].departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>, 
             Arrives at <strong>{new Date(flights[0].arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>. 
             Is this correct?
          </div>
        )}

        {/* Logic Warnings */}
        {logicWarnings.length > 0 && (
           <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold">
                 <AlertTriangle size={20} />
                 <h3>Itinerary Warning</h3>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                 {logicWarnings.map((w, idx) => (
                   <li key={idx} className="text-sm text-amber-700">{w}</li>
                 ))}
              </ul>
              <p className="text-xs text-amber-600 mt-2 font-medium">
                Please double-check your dates and airport codes. Proceeding with incorrect data may result in an inaccurate plan.
              </p>
           </div>
        )}

        <div className="space-y-6">
          {flights.map((flight) => (
            <div key={flight.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                  {flight.flightNumber}
                </span>
                {editingId !== flight.id ? (
                  <button
                    onClick={() => setEditingId(flight.id)}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSave(flight.id)}
                    className="text-green-600 font-medium text-sm hover:underline"
                  >
                    Save Changes
                  </button>
                )}
              </div>

              {editingId === flight.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Origin</label>
                    <input
                      className="w-full mt-1 p-2 border rounded"
                      value={flight.origin}
                      onChange={(e) => handleUpdate(flight.id, 'origin', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Destination</label>
                    <input
                      className="w-full mt-1 p-2 border rounded"
                      value={flight.destination}
                      onChange={(e) => handleUpdate(flight.id, 'destination', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Departure (Local)</label>
                    <input
                      type="datetime-local"
                      className="w-full mt-1 p-2 border rounded"
                      value={flight.departureTime.slice(0, 16)}
                      onChange={(e) => handleUpdate(flight.id, 'departureTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Arrival (Local)</label>
                    <input
                      type="datetime-local"
                      className="w-full mt-1 p-2 border rounded"
                      value={flight.arrivalTime.slice(0, 16)}
                      onChange={(e) => handleUpdate(flight.id, 'arrivalTime', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-slate-800">{flight.origin}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(flight.departureTime).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  
                  <div className="flex-1 text-center hidden md:block">
                    <div className="h-[2px] w-full bg-slate-300 relative">
                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-50 px-2 text-xs text-slate-400">
                         {flight.duration}
                       </div>
                    </div>
                  </div>

                  <div className="flex-1 md:text-right">
                    <p className="text-xl font-semibold text-slate-800">{flight.destination}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(flight.arrivalTime).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Grounding Sources */}
        {sources.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
             <p className="text-xs font-semibold text-slate-500 mb-2">VERIFIED SOURCES</p>
             <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors truncate max-w-[200px]"
                  >
                    <ExternalLink size={10} />
                    <span className="truncate">{source.title}</span>
                  </a>
                ))}
             </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onConfirm(flights)}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-green-600/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2"
      >
        <CheckCircle2 size={20} />
        {logicWarnings.length > 0 ? "Ignore Warnings & Confirm" : "Yes, this is correct"}
      </button>
    </div>
  );
};

export default FlightConfirmation;
