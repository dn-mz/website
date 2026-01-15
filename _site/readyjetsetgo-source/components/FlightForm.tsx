import React, { useState } from 'react';
import { Plus, Trash2, Plane, Calendar, Edit3, Clock, MapPin, XCircle, Loader2 } from 'lucide-react';
import { FlightInputData, FlightDetails } from '../types';

interface FlightFormProps {
  onSearch: (data: FlightInputData[]) => void;
  onManualSubmit: (data: FlightDetails[]) => void;
  isLoading: boolean;
  onStop: () => void;
}

const FlightForm: React.FC<FlightFormProps> = ({ onSearch, onManualSubmit, isLoading, onStop }) => {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

  // Auto Mode State
  const [flights, setFlights] = useState<{ id: string; flightNumber: string; date: string }[]>([
    { id: '1', flightNumber: '', date: '' }
  ]);

  // Manual Mode State
  const [manualFlights, setManualFlights] = useState<{
    id: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
  }[]>([
    { id: '1', flightNumber: '', origin: '', destination: '', departureTime: '', arrivalTime: '' }
  ]);

  // --- Auto Mode Handlers ---
  const addFlight = () => {
    setFlights([
      ...flights,
      { id: Date.now().toString(), flightNumber: '', date: '' }
    ]);
  };

  const removeFlight = (id: string) => {
    if (flights.length > 1) {
      setFlights(flights.filter(f => f.id !== id));
    }
  };

  const updateFlight = (id: string, field: 'flightNumber' | 'date', value: string) => {
    setFlights(flights.map(f => (f.id === id ? { ...f, [field]: value } : f)));
  };

  // --- Manual Mode Handlers ---
  const addManualFlight = () => {
    setManualFlights([
      ...manualFlights,
      { id: Date.now().toString(), flightNumber: '', origin: '', destination: '', departureTime: '', arrivalTime: '' }
    ]);
  };

  const removeManualFlight = (id: string) => {
    if (manualFlights.length > 1) {
      setManualFlights(manualFlights.filter(f => f.id !== id));
    }
  };

  const updateManualFlight = (id: string, field: keyof typeof manualFlights[0], value: string) => {
    setManualFlights(manualFlights.map(f => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'auto') {
      // Validate first flight has date
      if (!flights[0].date) {
        alert("Please enter a date for the first flight.");
        return;
      }

      if (flights.every(f => f.flightNumber)) {
        const payload: FlightInputData[] = flights.map(f => ({
          id: f.id,
          flightNumber: f.flightNumber,
          date: f.date
        }));
        onSearch(payload);
      }
    } else {
      // Manual Submit
      const payload: FlightDetails[] = manualFlights.map(f => ({
        id: f.id,
        flightNumber: f.flightNumber || 'N/A',
        origin: f.origin,
        destination: f.destination,
        departureTime: f.departureTime,
        arrivalTime: f.arrivalTime,
        duration: 'Manual Entry', // Cannot calculate accurately without timezone
        airline: 'Manual'
      }));
      onManualSubmit(payload);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl text-white ${mode === 'auto' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
          {mode === 'auto' ? <Plane size={24} /> : <Edit3 size={24} />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {mode === 'auto' ? 'Flight Details' : 'Manual Entry'}
          </h2>
          <p className="text-slate-500 text-sm">
            {mode === 'auto' ? 'Enter your itinerary' : 'Key in your flight schedule'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- AUTO FORM --- */}
        {mode === 'auto' && (
          <div className="space-y-4">
            {flights.map((flight, index) => (
              <div key={flight.id} className="relative animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">
                    {index === 0 ? 'Initial Flight' : `Stopover / Connection #${index}`}
                  </label>
                  {flights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFlight(flight.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                     <label className="block text-xs text-slate-400 mb-1">Flight Number</label>
                     <input
                      type="text"
                      placeholder="e.g. BA145"
                      value={flight.flightNumber}
                      onChange={(e) => updateFlight(flight.id, 'flightNumber', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      {index === 0 ? 'Date (Required)' : 'Date (Optional)'}
                    </label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        value={flight.date}
                        onChange={(e) => updateFlight(flight.id, 'date', e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-lg border outline-none transition-all bg-white ${
                          index === 0 && !flight.date ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                        }`}
                        required={index === 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={addFlight}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus size={16} />
                Add Stopover
              </button>
            </div>
          </div>
        )}

        {/* --- MANUAL FORM --- */}
        {mode === 'manual' && (
          <div className="space-y-6">
            {manualFlights.map((flight, index) => (
              <div key={flight.id} className="relative animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">{index + 1}</span>
                     <label className="block text-xs font-bold text-indigo-900 uppercase">
                       {index === 0 ? 'Initial Flight' : `Stopover`}
                     </label>
                  </div>
                  {manualFlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeManualFlight(flight.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                   {/* Row 1: Flight No, Origin, Dest */}
                   <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block text-xs text-slate-500 mb-1">Flight No.</label>
                        <input
                          type="text"
                          placeholder="Opt."
                          value={flight.flightNumber}
                          onChange={(e) => updateManualFlight(flight.id, 'flightNumber', e.target.value)}
                          className="w-full px-2 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs text-slate-500 mb-1">From</label>
                        <div className="relative">
                          <MapPin size={12} className="absolute left-2 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="JFK"
                            value={flight.origin}
                            onChange={(e) => updateManualFlight(flight.id, 'origin', e.target.value)}
                            className="w-full pl-6 pr-2 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs text-slate-500 mb-1">To</label>
                         <div className="relative">
                          <MapPin size={12} className="absolute left-2 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="LHR"
                            value={flight.destination}
                            onChange={(e) => updateManualFlight(flight.id, 'destination', e.target.value)}
                            className="w-full pl-6 pr-2 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                            required
                          />
                        </div>
                      </div>
                   </div>

                   {/* Row 2: Times */}
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Departs (Local)</label>
                         <div className="relative">
                          <Clock size={12} className="absolute left-2 top-2.5 text-slate-400" />
                          <input
                            type="datetime-local"
                            value={flight.departureTime}
                            onChange={(e) => updateManualFlight(flight.id, 'departureTime', e.target.value)}
                            className="w-full pl-6 pr-2 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Arrives (Local)</label>
                        <div className="relative">
                          <Clock size={12} className="absolute left-2 top-2.5 text-slate-400" />
                          <input
                            type="datetime-local"
                            value={flight.arrivalTime}
                            onChange={(e) => updateManualFlight(flight.id, 'arrivalTime', e.target.value)}
                            className="w-full pl-6 pr-2 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                            required
                          />
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
             <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={addManualFlight}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Plus size={16} />
                Add Flight
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex justify-center items-center gap-3"
          >
             <Loader2 size={20} className="animate-spin" />
             <span>Analyzing... (Stop)</span>
          </button>
        ) : (
          <button
            type="submit"
            className={`w-full text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex justify-center items-center ${
              mode === 'auto' 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
            }`}
          >
             {mode === 'auto' ? 'Analyze Route' : 'Use These Flights'}
          </button>
        )}
      </form>

      <div className="mt-6 text-center border-t border-slate-100 pt-4">
        <button 
          type="button"
          onClick={() => setMode(mode === 'auto' ? 'manual' : 'auto')}
          className="text-sm text-slate-500 hover:text-blue-600 underline decoration-slate-300 hover:decoration-blue-300 underline-offset-4 transition-all"
        >
          {mode === 'auto' ? "Key in flight details myself" : "Switch back to automatic search"}
        </button>
      </div>
    </div>
  );
};

export default FlightForm;
