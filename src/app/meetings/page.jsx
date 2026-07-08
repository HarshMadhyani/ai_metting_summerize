"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMeetingStore } from "@/store/useMeetingStore";
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  Trash2, 
  Bot, 
  CheckSquare, 
  Play, 
  Pause, 
  FileText, 
  ArrowLeft,
  Volume2,
  Download,
  Share2,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

function MeetingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const meetingIdParam = searchParams.get("id");

  const { meetings, deleteMeeting, toggleActionItem, selectedMeetingId, setSelectedMeetingId } = useMeetingStore();
  
  const [activeTab, setActiveTab] = useState("summary"); // summary | transcript
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [transcriptSearch, setTranscriptSearch] = useState("");

  // Audio Player State Simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const playerIntervalRef = useRef(null);

  // Sync route param with store selected meeting
  useEffect(() => {
    if (meetingIdParam) {
      setSelectedMeetingId(meetingIdParam);
    }
  }, [meetingIdParam, setSelectedMeetingId]);

  // Reset audio player when active meeting changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (playerIntervalRef.current) {
      clearInterval(playerIntervalRef.current);
    }
  }, [selectedMeetingId]);

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  // Simulated player tick
  useEffect(() => {
    if (isPlaying) {
      playerIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= (selectedMeeting?.durationSeconds || 100)) {
            setIsPlaying(false);
            clearInterval(playerIntervalRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playerIntervalRef.current) {
        clearInterval(playerIntervalRef.current);
      }
    }

    return () => {
      if (playerIntervalRef.current) {
        clearInterval(playerIntervalRef.current);
      }
    };
  }, [isPlaying, selectedMeeting]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainSecs.toString().padStart(2, "0")}`;
  };

  const handleSelectMeeting = (id) => {
    setSelectedMeetingId(id);
    // update URL query param
    router.push(`/meetings?id=${id}`);
  };

  const handleDelete = (id, title, e) => {
    e.stopPropagation();
    deleteMeeting(id);
    toast.success(`Deleted "${title}"`);
    router.push("/meetings");
  };

  // Filter meetings list
  const filteredMeetings = meetings.filter((meet) => {
    const matchesSearch = meet.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || meet.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter transcript lines based on search
  const filteredTranscript = selectedMeeting?.transcript?.filter((line) => 
    line.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
    line.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Meetings Library</h1>
          <p className="text-xs text-slate-500">Access transcripts, AI summaries, and meeting recordings</p>
        </div>

        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition self-start"
        >
          <Play className="h-3 w-3" />
          Process New Meeting
        </Link>
      </div>

      {/* Main Layout Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-0">
        
        {/* Left Side: Filter and List Pane (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col h-full space-y-4">
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition"
              />
            </div>

            {/* Category Select Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "All" },
                { id: "workshop", label: "Workshop" },
                { id: "standup", label: "Standup" },
                { id: "interview", label: "Interview" },
                { id: "general", label: "General" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase transition ${
                    categoryFilter === cat.id
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-500 bg-transparent hover:text-slate-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Meetings list container */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[calc(100vh-280px)] pr-1">
            {filteredMeetings.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/10 border border-slate-900 rounded-2xl">
                <p className="text-xs text-slate-500">No matching meetings</p>
              </div>
            ) : (
              filteredMeetings.map((meet) => {
                const isActive = selectedMeeting?.id === meet.id;
                
                return (
                  <div
                    key={meet.id}
                    onClick={() => handleSelectMeeting(meet.id)}
                    className={`group cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
                      isActive
                        ? "bg-gradient-to-r from-blue-950/20 to-indigo-950/15 border-blue-500/40 shadow-lg shadow-blue-500/5"
                        : "bg-slate-900/20 border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-bold truncate ${isActive ? 'text-blue-400' : 'text-slate-200'}`}>
                          {meet.title}
                        </h4>
                        
                        <button
                          onClick={(e) => handleDelete(meet.id, meet.title, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-0.5 rounded transition duration-150"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(meet.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {meet.duration}
                        </span>
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {meet.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detailed Meeting Drawer (8 Columns) */}
        <div className="lg:col-span-8">
          {!selectedMeeting ? (
            <div className="h-[500px] flex flex-col items-center justify-center bg-slate-900/10 border border-slate-900 rounded-2xl p-8 text-center">
              <FileText className="h-12 w-12 text-slate-700 mb-4" />
              <h3 className="text-sm font-bold text-slate-400">No meeting selected</h3>
              <p className="text-xs text-slate-500 mt-1">Select a meeting from the sidebar list to inspect details.</p>
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              
              {/* Header Details */}
              <div className="p-6 border-b border-slate-900 bg-slate-900/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {selectedMeeting.category}
                      </span>
                      {selectedMeeting.status === "failed" && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                          failed
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white">{selectedMeeting.title}</h2>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(selectedMeeting.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {selectedMeeting.duration}
                      </span>
                      {selectedMeeting.speakerCount && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {selectedMeeting.speakerCount} speakers
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  {selectedMeeting.status === "completed" && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toast.success("Transcript link copied to clipboard")}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </button>
                      <Link
                        href="/chat"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/25 text-xs font-semibold text-indigo-300 transition"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        Ask AI
                      </Link>
                    </div>
                  )}
                </div>

                {/* Simulated Audio Player Widget */}
                {selectedMeeting.status === "completed" && (
                  <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-inner">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 transition shadow-lg shadow-blue-500/10"
                    >
                      {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white pl-0.5" />}
                    </button>
                    
                    <div className="flex-1 w-full space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Volume2 className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                          Simulated Meeting Audio
                        </span>
                        <span>{formatTime(currentTime)} / {formatTime(selectedMeeting.durationSeconds || 100)}</span>
                      </div>
                      
                      <div 
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const ratio = clickX / rect.width;
                          setCurrentTime(Math.floor(ratio * (selectedMeeting.durationSeconds || 100)));
                        }}
                        className="h-2 w-full bg-slate-900 rounded-full cursor-pointer relative overflow-hidden group/progress"
                      >
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full relative"
                          style={{ width: `${(currentTime / (selectedMeeting.durationSeconds || 100)) * 100}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white scale-0 group-hover/progress:scale-100 transition-transform"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              {selectedMeeting.status === "completed" && (
                <div className="border-b border-slate-900 bg-slate-900/10 flex">
                  {[
                    { id: "summary", label: "AI Summary", icon: Bot },
                    { id: "transcript", label: "Transcript", icon: FileText }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition ${
                        activeTab === tab.id
                          ? "text-blue-400"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                      
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="active-tab-bar"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Scrollable Tab Content */}
              <div className="p-6 max-h-[500px] overflow-y-auto">
                {selectedMeeting.status === "failed" ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-950/20 text-red-400 border border-red-900/30">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-400">Processing Failed</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      AI systems encountered an error during audio alignment. The recording file might be corrupt or too short.
                    </p>
                  </div>
                ) : activeTab === "summary" && selectedMeeting.summary ? (
                  <div className="space-y-6">
                    {/* Overview */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overview</h3>
                      <p className="text-sm leading-relaxed text-slate-200 bg-slate-950/25 border border-slate-900/50 rounded-xl p-4">
                        {selectedMeeting.summary.overview}
                      </p>
                    </div>

                    {/* Key Takeaways */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Takeaways</h3>
                      <ul className="space-y-2">
                        {selectedMeeting.summary.keyTakeaways.map((takeaway, idx) => (
                          <li key={idx} className="flex gap-2.5 text-sm text-slate-300">
                            <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Grid split of Decisions and Action items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-900">
                      
                      {/* Action Items */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Action Items</h3>
                        <div className="space-y-2.5">
                          {selectedMeeting.summary.actionItems.map((action) => (
                            <div key={action.id} className="flex gap-2.5 items-start">
                              <button
                                onClick={() => {
                                  toggleActionItem(selectedMeeting.id, action.id);
                                  toast.success("Task updated");
                                }}
                                className="mt-0.5 flex-shrink-0 flex h-4.5 w-4.5 items-center justify-center rounded border border-slate-800 hover:border-blue-500 text-blue-500 bg-slate-950/20 transition-colors"
                              >
                                {action.completed && <CheckSquare className="h-3.5 w-3.5" />}
                              </button>
                              
                              <div className="text-xs">
                                <p className={`leading-relaxed text-slate-200 ${action.completed ? "line-through text-slate-500" : ""}`}>
                                  {action.text}
                                </p>
                                <span className="text-[10px] text-slate-500 font-semibold">{action.assignee}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Decisions */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Decisions Made</h3>
                        <ul className="space-y-2.5">
                          {selectedMeeting.summary.decisions.map((decision, idx) => (
                            <li key={idx} className="flex gap-2.5 text-xs text-slate-300 bg-slate-950/15 border border-slate-900/50 rounded-xl p-3">
                              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>{decision}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                ) : (
                  // Transcript Search
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search transcript content..."
                        value={transcriptSearch}
                        onChange={(e) => setTranscriptSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition"
                      />
                    </div>

                    <div className="space-y-4">
                      {filteredTranscript?.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-6">No transcript lines match search query</p>
                      ) : (
                        filteredTranscript?.map((line) => {
                          const highlightText = (text, search) => {
                            if (!search) return text;
                            const parts = text.split(new RegExp(`(${search})`, "gi"));
                            return parts.map((part, i) => 
                              part.toLowerCase() === search.toLowerCase() 
                                ? <mark key={i} className="bg-yellow-500/30 text-white rounded-sm px-0.5">{part}</mark> 
                                : part
                            );
                          };

                          return (
                            <div key={line.id} className="flex gap-3 items-start hover:bg-slate-900/10 p-2 rounded-lg transition">
                              <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300">
                                {line.speaker.slice(0, 2).toUpperCase()}
                              </div>
                              
                              <div className="flex-1 space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-200">{line.speaker}</span>
                                  <span className="text-[9px] text-slate-500">{line.time}</span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-300">
                                  {highlightText(line.text, transcriptSearch)}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Extra Alert icon for errors
function AlertTriangle(props) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function MeetingsPage() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center text-slate-400 py-12">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider">Loading Meetings Library...</span>
        </div>
      </div>
    }>
      <MeetingsPageContent />
    </Suspense>
  );
}
