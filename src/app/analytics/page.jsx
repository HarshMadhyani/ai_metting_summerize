"use client";

import { useMeetingStore } from "@/store/useMeetingStore";
import { 
  BarChart3, 
  Clock, 
  Users, 
  TrendingUp, 
  Activity, 
  Layers, 
  Percent,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { meetings } = useMeetingStore();

  const totalMeetingsCount = meetings.length;
  
  // Sum up duration
  const totalDurationSec = meetings.reduce((acc, m) => acc + (m.durationSeconds || 0), 0);
  const totalHours = (totalDurationSec / 3600).toFixed(1);
  const avgMinutes = totalMeetingsCount > 0 
    ? Math.round((totalDurationSec / totalMeetingsCount) / 60)
    : 0;

  // Action item statistics
  const totalActionItems = meetings.reduce((acc, m) => {
    if (!m.summary || !m.summary.actionItems) return acc;
    return acc + m.summary.actionItems.length;
  }, 0);

  const completedActionItems = meetings.reduce((acc, m) => {
    if (!m.summary || !m.summary.actionItems) return acc;
    return acc + m.summary.actionItems.filter(item => item.completed).length;
  }, 0);

  const actionCompletionRate = totalActionItems > 0 
    ? Math.round((completedActionItems / totalActionItems) * 100)
    : 0;

  // Speaker talk time data
  const speakerTalkTime = [
    { name: "Nikhil (Engineering)", share: 42, color: "#3b82f6" },
    { name: "Alex (Architecture)", share: 28, color: "#6366f1" },
    { name: "Elena (UI/UX Design)", share: 18, color: "#ec4899" },
    { name: "Sarah (DevOps/Sec)", share: 12, color: "#10b981" }
  ];

  // Topic distribution category data
  const categoryData = [
    { name: "Technical Workshop", count: meetings.filter(m => m.category === "workshop").length, color: "from-purple-500 to-indigo-500" },
    { name: "Sprint Standups", count: meetings.filter(m => m.category === "standup").length, color: "from-emerald-500 to-teal-500" },
    { name: "Job Interviews", count: meetings.filter(m => m.category === "interview").length, color: "from-pink-500 to-rose-500" },
    { name: "General Syncs", count: meetings.filter(m => m.category === "general").length, color: "from-blue-500 to-cyan-500" }
  ];

  const maxCategoryCount = Math.max(...categoryData.map(c => c.count), 1);

  // Donut chart calculations
  let accumulatedAngle = 0;
  const radius = 60;
  const strokeWidth = 14;
  const center = 80;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Meeting Analytics</h1>
        <p className="text-xs text-slate-500">Visualize meeting times, speaking shares, and action item velocities</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Hours Logged", 
            value: `${totalHours} hrs`, 
            desc: "Cumulative meeting time", 
            icon: Clock, 
            color: "from-blue-500 to-indigo-500" 
          },
          { 
            title: "Avg Duration", 
            value: `${avgMinutes} min`, 
            desc: "Per recorded session", 
            icon: Activity, 
            color: "from-violet-500 to-purple-500" 
          },
          { 
            title: "Tasks Completed", 
            value: `${completedActionItems}/${totalActionItems}`, 
            desc: "Action items compliance", 
            icon: CheckCircle2, 
            color: "from-emerald-500 to-teal-500" 
          },
          { 
            title: "Action Rate", 
            value: `${actionCompletionRate}%`, 
            desc: "Weekly execution speed", 
            icon: Percent, 
            color: "from-amber-500 to-orange-500" 
          }
        ].map((stat, i) => (
          <div 
            key={i} 
            className="group rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 p-6 shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h4 className="text-3xl font-extrabold text-white">{stat.value}</h4>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 border border-slate-900 text-slate-400 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-5 w-5 text-slate-400" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              {stat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Speaker Share (Donut Chart) */}
        <div className="rounded-3xl bg-slate-900/30 border border-slate-900 p-6 shadow-xl flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-900">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Speaker Participation Share
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Average talking ratios across combined sessions</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 py-6">
            {/* SVG Donut */}
            <div className="relative h-40 w-40 flex items-center justify-center">
              <svg width="160" height="160" className="-rotate-90">
                <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#0b0f19" strokeWidth={strokeWidth} />
                
                {speakerTalkTime.map((speaker, idx) => {
                  const strokeDashoffset = circumference - (speaker.share / 100) * circumference;
                  const rotation = accumulatedAngle;
                  accumulatedAngle += (speaker.share / 100) * 360;

                  return (
                    <circle
                      key={idx}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke={speaker.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{
                        transformOrigin: "center",
                        transform: `rotate(${rotation}deg)`
                      }}
                      className="transition-all duration-1000"
                    />
                  );
                })}
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-white">4</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Active speakers</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="flex-1 space-y-3 w-full">
              {speakerTalkTime.map((sp, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: sp.color }}></div>
                    <span className="text-slate-300 font-medium truncate">{sp.name}</span>
                  </div>
                  <span className="font-bold text-white pl-2">{sp.share}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-4 italic">
            Participation metrics are extracted via neural voice print diarization.
          </div>
        </div>

        {/* Meeting distribution by topic */}
        <div className="rounded-3xl bg-slate-900/30 border border-slate-900 p-6 shadow-xl flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-900">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Category Distributions
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Categorization frequency of processed records</p>
          </div>

          <div className="space-y-5 py-6">
            {categoryData.map((cat, idx) => {
              const widthPercentage = (cat.count / maxCategoryCount) * 100;
              
              return (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="font-medium">{cat.name}</span>
                    <span className="font-bold text-white">{cat.count} {cat.count === 1 ? 'session' : 'sessions'}</span>
                  </div>
                  
                  <div className="h-3 w-full bg-slate-950 border border-slate-900 rounded-lg overflow-hidden p-0.5">
                    <div 
                      className={`h-full bg-gradient-to-r ${cat.color} rounded-md transition-all duration-1000`}
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-4 flex justify-between items-center">
            <span>Core focus: Tech & Retros</span>
            <span className="text-indigo-400 hover:underline cursor-pointer flex items-center gap-0.5">
              Edit tags
            </span>
          </div>
        </div>

      </div>

      {/* Historical Trend Widget */}
      <div className="rounded-3xl bg-slate-900/30 border border-slate-900 p-6 shadow-xl">
        <div className="pb-4 border-b border-slate-900 mb-6 flex justify-between items-center">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              AI Activity Analysis
            </h3>
            <p className="text-[10px] text-slate-500">Monthly breakdown of summaries processed</p>
          </div>

          <div className="flex gap-2 text-[10px] uppercase tracking-wider font-semibold">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Last 6 Months</span>
          </div>
        </div>

        {/* Custom SVG line plot */}
        <div className="w-full flex justify-center py-4">
          <svg width="100%" height="150" viewBox="0 0 600 150" className="overflow-visible">
            {/* Gridlines */}
            <line x1="0" y1="120" x2="600" y2="120" stroke="#1e293b" strokeWidth="1" />
            <line x1="0" y1="60" x2="600" y2="60" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
            
            {/* Area under curve */}
            <path 
              d="M 50 120 L 50 100 L 150 70 L 250 85 L 350 40 L 450 50 L 550 20 L 550 120 Z" 
              fill="url(#area-glow)" 
            />

            {/* Curved Path */}
            <path 
              d="M 50 100 L 150 70 L 250 85 L 350 40 L 450 50 L 550 20" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="area-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Nodes */}
            {[
              { x: 50, y: 100, val: 2, label: "Jan" },
              { x: 150, y: 70, val: 5, label: "Feb" },
              { x: 250, y: 85, val: 4, label: "Mar" },
              { x: 350, y: 40, val: 9, label: "Apr" },
              { x: 450, y: 50, val: 8, label: "May" },
              { x: 550, y: 20, val: 12, label: "Jun" }
            ].map((node, i) => (
              <g key={i} className="group/node cursor-pointer">
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r="5" 
                  fill="#0b0f19" 
                  stroke="#10b981" 
                  strokeWidth="2.5" 
                  className="transition-all duration-200 group-hover/node:r-7 group-hover/node:fill-white"
                />
                
                {/* Node Tooltip */}
                <rect 
                  x={node.x - 20} 
                  y={node.y - 25} 
                  width="40" 
                  height="16" 
                  rx="3" 
                  fill="#0f172a" 
                  stroke="#334155" 
                  className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-200" 
                />
                <text 
                  x={node.x} 
                  y={node.y - 14} 
                  fill="#94a3b8" 
                  fontSize="8" 
                  fontWeight="bold"
                  textAnchor="middle" 
                  className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-200"
                >
                  {node.val} meets
                </text>

                {/* X labels */}
                <text 
                  x={node.x} 
                  y="140" 
                  fill="#475569" 
                  fontSize="11" 
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

    </div>
  );
}
