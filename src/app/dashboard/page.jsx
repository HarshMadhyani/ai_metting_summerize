"use client";

import { useUser } from "@clerk/nextjs";
import { useMeetingStore } from "@/store/useMeetingStore";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Loader2, 
  Bot, 
  Sparkles, 
  Upload, 
  Activity, 
  Users, 
  CheckSquare, 
  ArrowRight,
  FileText,
  AlertTriangle,
  Play
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { meetings, activeUploads, deleteMeeting, toggleActionItem } = useMeetingStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic statistics
  const totalMeetingsCount = meetings.length;
  
  // Sum up duration
  const totalDurationSec = meetings.reduce((acc, m) => acc + (m.durationSeconds || 0), 0);
  const totalHours = (totalDurationSec / 3600).toFixed(1);

  // Count pending action items
  const pendingActionItems = meetings.reduce((acc, m) => {
    if (!m.summary || !m.summary.actionItems) return acc;
    return acc + m.summary.actionItems.filter(item => !item.completed).length;
  }, 0);

  // Processing files count
  const processingCount = activeUploads.length + meetings.filter(m => m.status === "processing").length;

  // Format date helper
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleDelete = (id, title) => {
    deleteMeeting(id);
    toast.success(`Deleted "${title}" successfully`);
  };

  // Get a list of top 3 pending action items
  const recentActions = meetings
    .filter(m => m.summary && m.summary.actionItems)
    .flatMap(m => m.summary.actionItems.map(item => ({ ...item, meetingId: m.id, meetingTitle: m.title })))
    .filter(item => !item.completed)
    .slice(0, 3);

  // SVG Chart Data - simulated last 7 days meeting count
  const activityData = [
    { day: "Thu", count: 2 },
    { day: "Fri", count: 4 },
    { day: "Sat", count: 1 },
    { day: "Sun", count: 0 },
    { day: "Mon", count: 5 },
    { day: "Tue", count: 3 },
    { day: "Wed", count: totalMeetingsCount }
  ];

  const maxCount = Math.max(...activityData.map(d => d.count), 1);
  const chartHeight = 120;
  const chartWidth = 360;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/50 via-indigo-950/40 to-slate-900/50 border border-slate-800/80 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Intelligence Center Active
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Welcome back, {isUserLoaded && user ? user.firstName : "User"}! 🚀
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              MeetMind AI has summarized your recent meetings and extracted critical action items. Let's make today productive.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link 
              href="/upload" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/35 transition-all duration-200"
            >
              <Upload className="h-4 w-4" />
              Upload Recording
            </Link>
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <Bot className="h-4 w-4 text-indigo-400" />
              Ask MeetMind AI
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Total Meetings", 
            value: totalMeetingsCount, 
            desc: "Processed sessions", 
            icon: FileText, 
            color: "from-blue-500 to-indigo-500" 
          },
          { 
            title: "Total Hours Saved", 
            value: `${totalHours}h`, 
            desc: "AI analysis timeline", 
            icon: Clock, 
            color: "from-violet-500 to-purple-500" 
          },
          { 
            title: "Pending Action Items", 
            value: pendingActionItems, 
            desc: "Assigned tasks remaining", 
            icon: CheckSquare, 
            color: "from-emerald-500 to-teal-500" 
          },
          { 
            title: "Active Processing", 
            value: processingCount, 
            desc: "Real-time AI workflows", 
            icon: Activity, 
            color: "from-amber-500 to-orange-500",
            pulse: processingCount > 0
          }
        ].map((stat, i) => (
          <div 
            key={i} 
            className="group relative rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h4 className="text-3xl font-extrabold text-white">{stat.value}</h4>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner text-slate-300 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-5 w-5 ${stat.pulse ? 'animate-pulse text-amber-400' : 'text-slate-400'}`} />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              {stat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Layout split in Dashboard widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Recent Meetings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Recent Meetings</h2>
              <p className="text-xs text-slate-500">Manage, preview, and review transcriptions</p>
            </div>
            
            <div className="relative max-w-xs w-full">
              <input 
                type="text" 
                placeholder="Search meetings..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-900/50 border border-slate-800/80 rounded-xl text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Active upload queue simulation */}
            <AnimatePresence>
              {activeUploads.map((up) => (
                <motion.div 
                  key={up.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-blue-900/50 bg-blue-950/20 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-950/80 border border-blue-900/50 text-blue-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white truncate max-w-md">{up.name}</h4>
                        <p className="text-xs text-blue-400 capitalize">{up.phase}...</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{(up.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>AI Engine Loading</span>
                      <span>{up.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-300"
                        style={{ width: `${up.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredMeetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/20 border border-slate-900 p-12 text-center">
                <FileText className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-slate-400 font-semibold text-sm">No meetings found</p>
                <p className="text-slate-500 text-xs mt-1">Try another search keyword or upload a file.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredMeetings.map((meet, idx) => (
                  <motion.div 
                    key={meet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative rounded-2xl bg-slate-900/30 border border-slate-900/80 hover:border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border ${
                        meet.status === "failed" 
                          ? "border-red-900/50 text-red-400 bg-red-950/10" 
                          : meet.status === "processing" 
                          ? "border-amber-900/50 text-amber-400 bg-amber-950/10" 
                          : "border-slate-800 text-blue-400"
                      }`}>
                        {meet.status === "failed" ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : meet.status === "processing" ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Play className="h-5 w-5 pl-0.5" />
                        )}
                      </div>
                      
                      <div className="space-y-1 max-w-lg">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link 
                            href={meet.status === "completed" ? `/meetings?id=${meet.id}` : "#"} 
                            className={`text-sm font-bold text-white hover:underline ${
                              meet.status !== "completed" && "pointer-events-none"
                            }`}
                          >
                            {meet.title}
                          </Link>
                          
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                            meet.category === "workshop" 
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                              : meet.category === "standup" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : meet.category === "interview" 
                              ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" 
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {meet.category}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(meet.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meet.duration}
                          </span>
                          {meet.speakerCount && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {meet.speakerCount} speakers
                            </span>
                          )}
                        </div>

                        {meet.summary && (
                          <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                            {meet.summary.overview}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {meet.status === "completed" && (
                        <Link 
                          href={`/meetings?id=${meet.id}`} 
                          className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(meet.id, meet.title)}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-900/50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Activity Chart & Urgent Actions */}
        <div className="space-y-6">
          {/* Weekly Activity custom graph */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-900 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              Weekly Summary Volume
            </h3>
            
            {/* Simple SVG Chart */}
            <div className="w-full flex justify-center py-2">
              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                {/* Gridlines */}
                <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#1e293b" strokeWidth="1" />
                <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                
                {/* Render Bars */}
                {activityData.map((d, i) => {
                  const barWidth = 24;
                  const spacing = (chartWidth - barWidth * activityData.length) / (activityData.length - 1);
                  const x = i * (barWidth + spacing);
                  const barHeight = (d.count / maxCount) * (chartHeight - 20);
                  const y = chartHeight - barHeight;

                  return (
                    <g key={i} className="group/bar">
                      {/* Gradient */}
                      <defs>
                        <linearGradient id={`gradient-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>

                      {/* Hover Tooltip */}
                      <rect 
                        x={x} 
                        y={y - 18} 
                        width={barWidth} 
                        height="14" 
                        rx="3" 
                        fill="#0f172a" 
                        stroke="#334155" 
                        className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200" 
                      />
                      <text 
                        x={x + barWidth / 2} 
                        y={y - 8} 
                        fill="#94a3b8" 
                        fontSize="9" 
                        fontWeight="bold"
                        textAnchor="middle" 
                        className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200"
                      >
                        {d.count}
                      </text>

                      {/* Active bar */}
                      <rect 
                        x={x} 
                        y={y} 
                        width={barWidth} 
                        height={barHeight} 
                        rx="4" 
                        fill={`url(#gradient-${i})`} 
                        className="transition-all duration-300 group-hover/bar:brightness-125"
                      />

                      {/* X labels */}
                      <text 
                        x={x + barWidth / 2} 
                        y={chartHeight + 15} 
                        fill="#475569" 
                        fontSize="10" 
                        textAnchor="middle"
                      >
                        {d.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-6 pt-4 border-t border-slate-900">
              <span>Peak Activity: Monday</span>
              <span>Updated live</span>
            </div>
          </div>

          {/* Urgent Actions from Recent Meetings */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-400" />
                Urgent Action Items
              </h3>
              
              <Link href="/meetings" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentActions.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No pending action items found. Good job!</p>
              ) : (
                recentActions.map((act) => (
                  <div 
                    key={act.id} 
                    className="flex gap-3 items-start p-3 rounded-xl bg-slate-900/25 border border-slate-900/50 hover:bg-slate-900/50 transition-colors"
                  >
                    <button 
                      onClick={() => {
                        toggleActionItem(act.meetingId, act.id);
                        toast.success("Task updated");
                      }}
                      className="mt-0.5 flex-shrink-0 flex h-4.5 w-4.5 items-center justify-center rounded border border-slate-700 hover:border-blue-500 text-blue-500 transition-colors"
                    >
                      {act.completed && <CheckSquare className="h-3.5 w-3.5" />}
                    </button>

                    <div className="flex-1 space-y-1 min-w-0">
                      <p className={`text-xs leading-relaxed text-slate-200 ${act.completed ? 'line-through text-slate-500' : ''}`}>
                        {act.text}
                      </p>
                      
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                          {act.assignee}
                        </span>
                        <span className="text-[9px] text-blue-400 font-semibold truncate max-w-[120px]">
                          {act.meetingTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Extra chevron icon since lucide uses ChevronRight
function ChevronRight(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}