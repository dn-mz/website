import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Moon, Coffee, Wine, Sun, Check, User, Pill, XCircle, Loader2 } from 'lucide-react';

interface PreferencesFormProps {
  onGenerate: (prefs: UserPreferences) => void;
  isLoading: boolean;
  onStop: () => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onGenerate, isLoading, onStop }) => {
  const [prefs, setPrefs] = useState<UserPreferences>({
    ageGroup: '30-50',
    chronotype: 'balanced',
    caffeine: 'necessary',
    alcohol: 'none',
    melatonin: 'natural',
    lightSensitivity: 'normal',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prefs);
  };

  const CaffeineOption = ({ value, label, sub }: { value: UserPreferences['caffeine'], label: string, sub: string }) => (
    <div 
      onClick={() => setPrefs({ ...prefs, caffeine: value })}
      className={`cursor-pointer border rounded-xl p-3 transition-all relative ${
        prefs.caffeine === value 
          ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' 
          : 'bg-white border-slate-200 hover:bg-slate-50'
      }`}
    >
       {prefs.caffeine === value && <div className="absolute top-2 right-2 text-amber-600"><Check size={16} /></div>}
       <div className="font-semibold text-slate-800 text-sm">{label}</div>
       <div className="text-xs text-slate-500 leading-snug mt-1">{sub}</div>
    </div>
  );

  const AlcoholOption = ({ value, label, sub }: { value: UserPreferences['alcohol'], label: string, sub: string }) => (
    <div 
      onClick={() => setPrefs({ ...prefs, alcohol: value })}
      className={`cursor-pointer border rounded-xl p-3 transition-all relative ${
        prefs.alcohol === value 
          ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500' 
          : 'bg-white border-slate-200 hover:bg-slate-50'
      }`}
    >
       {prefs.alcohol === value && <div className="absolute top-2 right-2 text-rose-600"><Check size={16} /></div>}
       <div className="font-semibold text-slate-800 text-sm">{label}</div>
       <div className="text-xs text-slate-500 leading-snug mt-1">{sub}</div>
    </div>
  );

  const MelatoninOption = ({ value, label, sub }: { value: UserPreferences['melatonin'], label: string, sub: string }) => (
    <div 
      onClick={() => setPrefs({ ...prefs, melatonin: value })}
      className={`cursor-pointer border rounded-xl p-3 transition-all relative ${
        prefs.melatonin === value 
          ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
          : 'bg-white border-slate-200 hover:bg-slate-50'
      }`}
    >
       {prefs.melatonin === value && <div className="absolute top-2 right-2 text-indigo-600"><Check size={16} /></div>}
       <div className="font-semibold text-slate-800 text-sm">{label}</div>
       <div className="text-xs text-slate-500 leading-snug mt-1">{sub}</div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Customize Your Bio-Profile</h2>
        <p className="text-slate-500 text-sm">Help us tailor the recommendations to your habits.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Age Group */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <User size={18} className="text-blue-500" />
            Age Group
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {['0-18', '18-30', '30-50', '50-70', '70+'].map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => setPrefs({ ...prefs, ageGroup: age as any })}
                className={`py-2 px-1 rounded-lg border text-center transition-all text-sm font-medium ${
                  prefs.ageGroup === age
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Chronotype */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Moon size={18} className="text-indigo-500" />
            Sleep Chronotype
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'early_bird', label: 'Early Bird', desc: 'Up with the sun' },
              { id: 'balanced', label: 'Balanced', desc: 'Standard schedule' },
              { id: 'night_owl', label: 'Night Owl', desc: 'Late to bed' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setPrefs({ ...prefs, chronotype: type.id as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  prefs.chronotype === type.id
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-800 text-sm">{type.label}</div>
                <div className="text-xs text-slate-500">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Caffeine Strategy */}
        <div>
           <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <Coffee size={18} className="text-amber-700" />
              Caffeine Strategy
           </label>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CaffeineOption 
                value="avoid" 
                label="No Caffeine" 
                sub="I don't drink caffeine." 
              />
              <CaffeineOption 
                value="necessary" 
                label="As Needed" 
                sub="Only when alertness is critical." 
              />
              <CaffeineOption 
                value="optimized" 
                label="Optimized" 
                sub="Use as a tool to shift my clock." 
              />
           </div>
        </div>

        {/* Alcohol Strategy */}
        <div>
           <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <Wine size={18} className="text-rose-500" />
              Alcohol Preference
           </label>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AlcoholOption 
                value="none" 
                label="Dry Travel" 
                sub="I won't be drinking." 
              />
              <AlcoholOption 
                value="relax" 
                label="Relaxation" 
                sub="I plan to have a drink to relax." 
              />
           </div>
        </div>

        {/* Melatonin Strategy */}
        <div>
           <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <Pill size={18} className="text-indigo-600" />
              Melatonin Preference
           </label>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MelatoninOption 
                value="natural" 
                label="Natural Only" 
                sub="No supplements, just light control." 
              />
              <MelatoninOption 
                value="supplements" 
                label="Supplement Friendly" 
                sub="I'm open to taking Melatonin." 
              />
           </div>
        </div>

        {/* Light Sensitivity */}
        <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <Sun size={18} className="text-orange-500" />
              Light Sensitivity
            </label>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
               <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={prefs.lightSensitivity === 'low' ? 0 : prefs.lightSensitivity === 'high' ? 2 : 1}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const map = ['low', 'normal', 'high'];
                  setPrefs({...prefs, lightSensitivity: map[val] as any});
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
               />
               <div className="flex justify-between text-xs text-slate-500 font-medium px-1 mt-2">
                 <span>Low</span>
                 <span>Normal</span>
                 <span>High</span>
               </div>
            </div>
          </div>

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-3"
          >
             <Loader2 size={20} className="animate-spin" />
             <span>Generating Plan... (Stop)</span>
          </button>
        ) : (
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            Generate Schedule
          </button>
        )}
      </form>
    </div>
  );
};

export default PreferencesForm;
