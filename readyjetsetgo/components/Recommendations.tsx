import React from 'react';
import { Recommendation, JetLagPlan } from '../types';
import { ShoppingBag, ExternalLink, Package } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Recommendation[];
  scienceLinks: JetLagPlan['scienceLinks'];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, scienceLinks }) => {
  return (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200">
      
      {/* Traveler's Toolkit */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center justify-center gap-3 mb-4">
              <Package size={28} className="text-indigo-600" />
              <h2 className="text-3xl font-bold text-slate-800 text-center">Traveler’s Toolkit</h2>
           </div>
           <p className="text-center text-slate-500 max-w-2xl mx-auto mb-8">
             Gear scientifically proven to help you adapt to new time zones faster.
           </p>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             {recommendations.flatMap(cat => cat.items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
                   {/* Placeholder for Product Image - In a real app this would be dynamic */}
                   <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-300">
                      <ShoppingBag size={48} />
                   </div>
                   
                   <div className="p-5 flex flex-col flex-1">
                      <div className="flex-1">
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2 block">{cat.category}</span>
                        <h4 className="font-bold text-slate-800 text-lg mb-2 leading-tight">{item.name}</h4>
                        <p className="text-sm text-slate-500 mb-4">{item.description}</p>
                      </div>
                      
                      {item.affiliatePlaceholder && (
                        <button className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                           View on Amazon <ExternalLink size={14} />
                        </button>
                      )}
                   </div>
                </div>
             )))}
           </div>
        </div>
      )}

      {/* Science Links */}
      {scienceLinks && scienceLinks.length > 0 && (
        <div className="bg-blue-900 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative mt-12">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-800 opacity-30 blur-3xl"></div>
          
          <h3 className="text-2xl font-bold mb-6 relative z-10 flex items-center gap-2">
             <span>📚</span> The Reasoning Behind Your Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {scienceLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group block bg-blue-800/40 hover:bg-blue-700/60 border border-blue-700/50 rounded-xl p-4 transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h5 className="font-bold text-base mb-2 group-hover:text-blue-200 transition-colors">{link.title}</h5>
                    <p className="text-sm text-blue-200/80 leading-relaxed">{link.description}</p>
                  </div>
                  <ExternalLink size={16} className="text-blue-400 shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
