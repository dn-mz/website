import React, { useState, useRef } from 'react';
import FlightForm from './components/FlightForm';
import FlightConfirmation from './components/FlightConfirmation';
import PreferencesForm from './components/PreferencesForm';
import Timeline from './components/Timeline';
import Recommendations from './components/Recommendations';
import { FlightInputData, FlightDetails, GroundingSource, UserPreferences, JetLagPlan } from './types';
import { searchFlightInfo, generateJetLagPlan } from './services/geminiService';
import { CalendarClock, ChevronLeft, Sparkles, BookOpen, MessageCircleQuestion, Plane, Edit } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'confirm' | 'preferences' | 'result'>('input');
  
  // Data State
  const [foundFlights, setFoundFlights] = useState<FlightDetails[]>([]);
  const [foundSources, setFoundSources] = useState<GroundingSource[]>([]);
  const [plan, setPlan] = useState<JetLagPlan | null>(null);
  
  // Toggles for Result View
  const [showPreFlight, setShowPreFlight] = useState(true);
  const [showPostFlight, setShowPostFlight] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controller for cancelling requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // Handlers
  const handleFlightSearch = async (inputs: FlightInputData[]) => {
    // Clear any previous controller
    handleStop();
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      const { flights, sources } = await searchFlightInfo(inputs, controller.signal);
      if (flights.length === 0) {
        throw new Error("No flight information found. Please verify details.");
      }
      setFoundFlights(flights);
      setFoundSources(sources);
      setStep('confirm');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Operation aborted");
        return;
      }
      setError(err.message || "Failed to find flights.");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleManualEntry = (manualFlights: FlightDetails[]) => {
    setFoundFlights(manualFlights);
    setFoundSources([]); // No sources for manual entry
    setError(null);
    setStep('confirm');
  };

  const handleFlightConfirmation = (confirmedFlights: FlightDetails[]) => {
    setFoundFlights(confirmedFlights);
    setStep('preferences');
  };

  const handleGeneratePlan = async (prefs: UserPreferences) => {
    // Clear any previous controller
    handleStop();
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateJetLagPlan(foundFlights, prefs, controller.signal);
      setPlan(generatedPlan);
      setStep('result');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Operation aborted");
        return;
      }
      setError(err.message || "Failed to generate plan.");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const resetApp = () => {
    handleStop();
    setStep('input');
    setFoundFlights([]);
    setPlan(null);
    setError(null);
    setShowPreFlight(true);
    setShowPostFlight(true);
    setShowExplanation(true);
  };

  const goBack = () => {
    if (step === 'confirm') setStep('input');
    else if (step === 'preferences') setStep('confirm');
    else if (step === 'result') setStep('preferences');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <CalendarClock size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Ready, Jet Set, Go</h1>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            AI-Powered Travel Recommendations
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pt-10">
        
        {/* Navigation & Progress */}
        <div className="mb-8">
           <div className="flex justify-center mb-6 gap-2">
             {['input', 'confirm', 'preferences', 'result'].map((s, i) => (
               <div 
                 key={s} 
                 className={`h-2 rounded-full transition-all duration-300 ${
                   ['input', 'confirm', 'preferences', 'result'].indexOf(step) >= i 
                   ? 'w-12 bg-blue-600' 
                   : 'w-4 bg-slate-200'
                 }`} 
               />
             ))}
           </div>
           
           {step !== 'input' && (
              <button 
                onClick={goBack}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
              >
                <ChevronLeft size={16} /> Back
              </button>
           )}
        </div>

        {error && (
          <div className="max-w-lg mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Oops! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {step === 'input' && (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">
              Beat Jet Lag
            </h1>
            <p className="text-lg text-slate-600 mb-10 text-center max-w-xl">
              Enter your flight details into our jet lag calculator. We'll build a custom chrono-biological flight plan for your body.
            </p>
            <FlightForm 
              onSearch={handleFlightSearch} 
              onManualSubmit={handleManualEntry}
              isLoading={isLoading}
              onStop={handleStop}
            />
          </div>
        )}

        {step === 'confirm' && (
          <FlightConfirmation 
            flights={foundFlights} 
            sources={foundSources}
            onConfirm={handleFlightConfirmation} 
            onReset={resetApp} 
          />
        )}

        {step === 'preferences' && (
          <PreferencesForm onGenerate={handleGeneratePlan} isLoading={isLoading} onStop={handleStop} />
        )}

        {step === 'result' && plan && (
          <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            
            {/* Flight Summary Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flight Itinerary</h3>
                 <button onClick={() => setStep('confirm')} className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1">
                   <Edit size={12} /> Edit Details
                 </button>
              </div>
              <div className="space-y-2">
                {foundFlights.map((f, i) => (
                   <div key={i} className="flex flex-wrap items-center gap-x-2 text-sm text-slate-800">
                      <Plane size={14} className="text-slate-400" />
                      <span className="font-semibold">{f.origin}</span>
                      <span className="text-slate-500 text-xs">({new Date(f.departureTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})</span>
                      <span className="text-slate-300">→</span>
                      <span className="font-semibold">{f.destination}</span>
                      <span className="text-slate-500 text-xs">({new Date(f.arrivalTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})</span>
                   </div>
                ))}
              </div>
            </div>

            {/* Advice Toggles */}
            <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200 justify-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={showPreFlight}
                  onChange={(e) => setShowPreFlight(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`text-sm font-medium flex items-center gap-1 ${showPreFlight ? 'text-slate-800' : 'text-slate-400'}`}>
                   <Sparkles size={16} className={showPreFlight ? 'text-amber-500' : 'text-slate-300'} /> 
                   Pre-Flight Advice
                </span>
              </label>
              
              <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={showPostFlight}
                  onChange={(e) => setShowPostFlight(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`text-sm font-medium flex items-center gap-1 ${showPostFlight ? 'text-slate-800' : 'text-slate-400'}`}>
                   <BookOpen size={16} className={showPostFlight ? 'text-indigo-500' : 'text-slate-300'} /> 
                   Post-Flight Advice
                </span>
              </label>

              <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={showExplanation}
                  onChange={(e) => setShowExplanation(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`text-sm font-medium flex items-center gap-1 ${showExplanation ? 'text-slate-800' : 'text-slate-400'}`}>
                   <MessageCircleQuestion size={16} className={showExplanation ? 'text-blue-500' : 'text-slate-300'} /> 
                   Explanations
                </span>
              </label>
            </div>

            <Timeline 
              schedule={plan.schedule} 
              direction={plan.direction} 
              showPreFlight={showPreFlight}
              showPostFlight={showPostFlight}
              showExplanation={showExplanation}
            />

            <Recommendations 
               recommendations={plan.recommendations || []}
               scienceLinks={plan.scienceLinks}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
