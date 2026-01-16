import React from 'react';
import { ScheduleEvent, EventType } from '../types';
import { Moon, Sun, Coffee, Utensils, Plane, EyeOff, Activity, ShieldAlert, Sparkles, BookOpen, MessageCircleQuestion, Footprints } from 'lucide-react';

interface TimelineProps {
  schedule: ScheduleEvent[];
  direction: string;
  showPreFlight: boolean;
  showPostFlight: boolean;
  showExplanation: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ schedule, direction, showPreFlight, showPostFlight, showExplanation }) => {
  const getIcon = (type: EventType) => {
    switch (type) {
      case EventType.SLEEP: return <Moon size={20} className="text-indigo-200" />;
      case EventType.LIGHT: return <Sun size={20} className="text-yellow-100" />;
      case EventType.DARK: return <EyeOff size={20} className="text-slate-200" />;
      case EventType.FOOD: return <Utensils size={20} className="text-emerald-100" />;
      case EventType.CAFFEINE: return <Coffee size={20} className="text-amber-100" />;
      case EventType.FLIGHT: return <Plane size={20} className="text-blue-100" />;
      case EventType.TRANSIT: return <Footprints size={20} className="text-sky-100" />;
      case EventType.ACTIVITY: return <Activity size={20} className="text-rose-100" />;
      default: return <ShieldAlert size={20} className="text-slate-100" />;
    }
  };

  const getColor = (type: EventType) => {
    switch (type) {
      case EventType.SLEEP: return 'bg-indigo-900 border-indigo-700';
      case EventType.LIGHT: return 'bg-yellow-500 border-yellow-400';
      case EventType.DARK: return 'bg-slate-800 border-slate-700';
      case EventType.FOOD: return 'bg-emerald-600 border-emerald-500';
      case EventType.CAFFEINE: return 'bg-amber-700 border-amber-600';
      case EventType.FLIGHT: return 'bg-blue-600 border-blue-500';
      case EventType.TRANSIT: return 'bg-sky-500 border-sky-400';
      default: return 'bg-slate-500 border-slate-400';
    }
  };

  // Group events by phase
  const preEvents = schedule.filter(e => e.phase === 'PRE');
  const flightEvents = schedule.filter(e => e.phase === 'FLIGHT');
  const postEvents = schedule.filter(e => e.phase === 'POST');

  const Section = ({ title, events, icon: Icon, colorClass }: { title: string, events: ScheduleEvent[], icon: any, colorClass: string }) => (
    <div className="mb-10">
      <div className={`flex items-center gap-2 mb-6 pb-2 border-b-2 ${colorClass}`}>
        <Icon size={24} className="text-slate-700" />
        <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
      </div>
      
      {events.length === 0 ? (
        <p className="text-slate-400 italic">No events generated for this phase.</p>
      ) : (
        <div className="relative pl-4 border-l-2 border-slate-200 ml-4 space-y-8 py-2">
          {events.map((event, idx) => (
            <div key={idx} className="relative pl-8 group">
              {/* Timeline Dot */}
              <div 
                className={`absolute -left-[29px] w-10 h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 ${getColor(event.type)}`}
              >
                {getIcon(event.type)}
              </div>

              {/* Content Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:shadow-md transition-shadow">
                 <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-start gap-3 mb-2">
                   <h4 className="font-bold text-slate-800 text-lg flex-1">{event.title}</h4>
                   <div className="text-right">
                     <span className="inline-block text-xs font-mono font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap">
                       {event.time}
                     </span>
                   </div>
                 </div>
                 <p className="text-slate-600 text-sm leading-relaxed mb-3">{event.description}</p>
                 
                 {/* Explanation Note */}
                 {showExplanation && event.scienceNote && (
                   <div className="mt-3 flex gap-3 bg-blue-50 rounded-lg p-3 border border-blue-100 animate-in fade-in duration-300">
                      <div className="mt-0.5 min-w-[16px]">
                        <MessageCircleQuestion size={16} className="text-blue-500" />
                      </div>
                      <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        <span className="font-bold uppercase tracking-wide text-blue-800 mr-1">Explanation:</span>
                        {event.scienceNote}
                      </p>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <div className="flex justify-between items-center mb-8">
         <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Plan Direction</div>
         <span className="text-xs font-bold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
           {direction} BOUND
        </span>
      </div>

      {showPreFlight && preEvents.length > 0 && (
        <Section 
          title="Pre-Flight Prep" 
          events={preEvents} 
          icon={Sparkles}
          colorClass="border-amber-400"
        />
      )}

      <Section 
        title="Flight Plan" 
        events={flightEvents} 
        icon={Plane} 
        colorClass="border-blue-500"
      />

      {showPostFlight && postEvents.length > 0 && (
        <Section 
          title="Post-Flight Recovery" 
          events={postEvents} 
          icon={BookOpen}
          colorClass="border-indigo-400"
        />
      )}
    </div>
  );
};

export default Timeline;
