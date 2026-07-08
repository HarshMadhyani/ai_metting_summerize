"use client";

import { useState } from "react";
import { useMeetingStore } from "@/store/useMeetingStore";
import { 
  Upload, 
  FileText, 
  Settings2, 
  Globe, 
  Users2, 
  FileCheck, 
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const { simulateUpload, activeUploads, meetings } = useMeetingStore();
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Configurations
  const [category, setCategory] = useState("general");
  const [language, setLanguage] = useState("en");
  const [speakers, setSpeakers] = useState(2);
  const [template, setTemplate] = useState("detailed");

  // Track if a file was just finished uploading to show success screen
  const [lastFinishedUploadId, setLastFinishedUploadId] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload an audio (MP3, WAV, M4A) or video (MP4) file.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload an audio (MP3, WAV, M4A) or video (MP4) file.");
      }
    }
  };

  const isValidFileType = (file) => {
    const validExtensions = ["mp3", "wav", "m4a", "mp4", "mpeg"];
    const ext = file.name.split(".").pop().toLowerCase();
    return validExtensions.includes(ext);
  };

  const handleStartProcess = () => {
    if (!selectedFile) return;

    // Trigger Zustand store simulator
    simulateUpload(selectedFile.name, selectedFile.size, {
      category,
      language,
      speakers,
      template
    });

    toast.success("AI Transcription and analysis started!");
    const uploadName = selectedFile.name;
    setSelectedFile(null); // Clear selected file
  };

  // Find if there is an active upload in progress
  const currentActiveUpload = activeUploads[activeUploads.length - 1];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Analyze New Meeting</h1>
        <p className="text-xs text-slate-500">Upload audio or video files to generate transcripts and AI summaries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Drag Zone / Progress (7 Columns) */}
        <div className="md:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {currentActiveUpload ? (
              // Active Uploading Screen
              <motion.div
                key="active-progress"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-3xl border border-slate-900 bg-slate-900/30 p-8 text-center space-y-8 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                    <Loader2 className="h-7 w-7 animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Analyzing Meeting</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Our AI models are aligned to transcribe speakers, extract key decisions, and write summary documentation.
                  </p>
                </div>

                <div className="space-y-4 bg-slate-950/50 border border-slate-900 rounded-2xl p-5 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 truncate max-w-[200px]">
                      {currentActiveUpload.name}
                    </span>
                    <span className="text-slate-500">
                      {(currentActiveUpload.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                      <span className="text-blue-400 font-semibold">{currentActiveUpload.phase}</span>
                      <span className="text-slate-400">{currentActiveUpload.progress}%</span>
                    </div>
                    
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                        style={{ width: `${currentActiveUpload.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Step status tags */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[9px] uppercase tracking-wider font-semibold">
                    <div className={`py-1.5 rounded-lg border ${
                      currentActiveUpload.progress >= 30 
                        ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" 
                        : "border-slate-800 text-slate-600"
                    }`}>
                      1. Upload
                    </div>
                    <div className={`py-1.5 rounded-lg border ${
                      currentActiveUpload.progress >= 70 
                        ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" 
                        : currentActiveUpload.progress >= 30
                        ? "border-blue-500/20 text-blue-400 bg-blue-500/5 animate-pulse"
                        : "border-slate-800 text-slate-600"
                    }`}>
                      2. Transcribe
                    </div>
                    <div className={`py-1.5 rounded-lg border ${
                      currentActiveUpload.progress >= 95 
                        ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" 
                        : currentActiveUpload.progress >= 70
                        ? "border-blue-500/20 text-blue-400 bg-blue-500/5 animate-pulse"
                        : "border-slate-800 text-slate-600"
                    }`}>
                      3. Summarize
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic">
                  Keep this window open during analysis. Process completes in under a minute.
                </div>
              </motion.div>
            ) : selectedFile ? (
              // File Selected ready to start Screen
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-3xl border border-slate-900 bg-slate-900/30 p-8 text-center space-y-6 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white truncate max-w-xs mx-auto">
                    {selectedFile.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    File Type: {selectedFile.type || selectedFile.name.split(".").pop().toUpperCase()} • {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartProcess}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/15 flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Start AI Analysis
                  </button>
                </div>
              </motion.div>
            ) : (
              // Drag and Drop Zone
              <motion.div
                key="drag-zone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] shadow-xl ${
                  dragActive 
                    ? "border-blue-500 bg-blue-500/5 shadow-blue-500/5" 
                    : "border-slate-800 bg-slate-900/10 hover:border-slate-700/80 hover:bg-slate-900/20"
                }`}
              >
                <input
                  type="file"
                  id="file-upload-input"
                  multiple={false}
                  onChange={handleFileChange}
                  accept="audio/*,video/*"
                  className="hidden"
                />
                
                <label htmlFor="file-upload-input" className="cursor-pointer space-y-4 flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 border border-slate-900 text-slate-400 group-hover:scale-105 transition-transform duration-200">
                    <Upload className="h-6 w-6 text-blue-500" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-200">Drag & drop your recording here</h3>
                    <p className="text-xs text-slate-500">or click to browse local files</p>
                  </div>

                  <div className="text-[10px] text-slate-600 font-medium">
                    Supports MP3, WAV, M4A, or MP4 files up to 100MB
                  </div>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt suggesting meetings page link */}
          {!currentActiveUpload && meetings.length > 0 && (
            <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Looking for past meetings?</h4>
                  <p className="text-[10px] text-slate-500">Access all summaries in the meetings library.</p>
                </div>
              </div>
              
              <Link 
                href="/meetings" 
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Settings Configs (5 Columns) */}
        <div className="md:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
            <Settings2 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Analysis Options</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Category Select */}
            <div className="space-y-2">
              <label className="block text-slate-400 font-semibold">Meeting Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500/50"
              >
                <option value="general">General Meeting</option>
                <option value="workshop">Technical Workshop</option>
                <option value="standup">Sprint Standup</option>
                <option value="interview">Job Interview</option>
              </select>
            </div>

            {/* Language Select */}
            <div className="space-y-2">
              <label className="block text-slate-400 font-semibold flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                Audio Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500/50"
              >
                <option value="en">English (US/UK)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="ja">Japanese (日本語)</option>
              </select>
            </div>

            {/* Speaker Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-400 font-semibold flex items-center gap-1">
                  <Users2 className="h-3.5 w-3.5 text-slate-500" />
                  Estimated Speakers
                </label>
                <span className="text-slate-400 font-bold">{speakers}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={speakers}
                onChange={(e) => setSpeakers(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Summary Format Template */}
            <div className="space-y-2">
              <label className="block text-slate-400 font-semibold flex items-center gap-1">
                <FileCheck className="h-3.5 w-3.5 text-slate-500" />
                AI Summary Template
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "detailed", label: "Structured Specs", desc: "Overview, tasks, actions" },
                  { id: "bullets", label: "Bulleted Keynotes", desc: "Short items outline" },
                  { id: "minimal", label: "Executive Recap", desc: "Paragraph summary" },
                  { id: "custom", label: "Sprint Action Plan", desc: "Sprint retro layout" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTemplate(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      template === item.id
                        ? "border-indigo-500/60 bg-indigo-950/10 text-white"
                        : "border-slate-800 bg-transparent text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <p className="font-bold text-[10px] leading-tight">{item.label}</p>
                    <p className="text-[8px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
