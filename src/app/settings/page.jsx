"use client";

import { useState } from "react";
import { 
  Settings, 
  Bot, 
  Key, 
  Bell, 
  Network, 
  Sliders, 
  Sparkles,
  Save,
  CheckCircle2,
  Calendar,
  Video
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [model, setModel] = useState("claude-3.5");
  const [apiKey, setApiKey] = useState("sk-••••••••••••••••••••");
  const [language, setLanguage] = useState("en");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [slackConnected, setSlackConnected] = useState(false);
  const [gcalConnected, setGcalConnected] = useState(true);
  const [zoomConnected, setZoomConnected] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white">System Settings</h1>
          <p className="text-xs text-slate-500">Configure AI models, workflow integrations, and notification rules</p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/10 transition"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Navigation Tabs links (Mock tabs for design) */}
        <div className="md:col-span-1 bg-slate-900/30 border border-slate-900 rounded-3xl p-5 space-y-2 h-fit shadow-xl">
          {[
            { id: "general", label: "AI Configuration", icon: Bot },
            { id: "notifications", label: "Notification Rules", icon: Bell },
            { id: "integrations", label: "Integrations & APIs", icon: Network }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition text-left ${
                tab.id === "general"
                  ? "bg-slate-900 text-blue-400 border border-slate-800"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <tab.icon className="h-4.5 w-4.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Column: Settings Sections (2 Columns) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* AI Settings Card */}
          <div className="rounded-3xl bg-slate-900/30 border border-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
              <Sliders className="h-4 w-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Model Preferences</h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Core LLM selector */}
              <div className="space-y-2">
                <label className="block text-slate-400 font-semibold">Primary Synthesis Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="claude-3.5">Claude 3.5 Sonnet (Recommended)</option>
                  <option value="gpt-4o">OpenAI GPT-4o (Premium)</option>
                  <option value="llama-3">Llama 3 70B (Fast)</option>
                </select>
                <span className="text-[10px] text-slate-500">Claude offers superior semantic parsing for transcripts.</span>
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <label className="block text-slate-400 font-semibold flex items-center justify-between">
                  <span>Custom Model API Key (Optional)</span>
                  <span className="text-indigo-400 cursor-pointer hover:underline flex items-center gap-0.5">
                    <Key className="h-3 w-3" />
                    How to get
                  </span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API Key (sk-...)"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="rounded-3xl bg-slate-900/30 border border-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
              <Bell className="h-4 w-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Notification Rules</h3>
            </div>

            <div className="space-y-4">
              {/* Email Alert Toggle */}
              <div className="flex items-center justify-between text-xs py-1">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-slate-200">Email Summaries</h4>
                  <p className="text-[10px] text-slate-500">Send completed meeting recaps directly to your inbox</p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-9 h-5 rounded-full p-0.5 transition duration-200 focus:outline-none ${
                    emailAlerts ? "bg-blue-600 flex justify-end" : "bg-slate-850 flex justify-start border border-slate-800"
                  }`}
                >
                  <div className="h-3.8 w-3.8 bg-white rounded-full shadow"></div>
                </button>
              </div>

              {/* Push Alerts Toggle */}
              <div className="flex items-center justify-between text-xs py-1 border-t border-slate-900 pt-3">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-slate-200">Browser Push Alerts</h4>
                  <p className="text-[10px] text-slate-500">Alert on desktop when transcription processing completes</p>
                </div>
                <button
                  onClick={() => setPushAlerts(!pushAlerts)}
                  className={`w-9 h-5 rounded-full p-0.5 transition duration-200 focus:outline-none ${
                    pushAlerts ? "bg-blue-600 flex justify-end" : "bg-slate-800 flex justify-start border border-slate-700"
                  }`}
                >
                  <div className="h-3.8 w-3.8 bg-white rounded-full shadow"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Integrations Card */}
          <div className="rounded-3xl bg-slate-900/30 border border-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
              <Network className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Connected Integrations</h3>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Slack Connection */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center">
                    <SlackIcon className="h-4.5 w-4.5 text-pink-500 fill-current" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-200">Slack Notifications</h4>
                    <p className="text-[10px] text-slate-500">Publish generated takeaways to channels</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSlackConnected(!slackConnected);
                    toast.success(slackConnected ? "Disconnected from Slack" : "Connected to Slack workspace!");
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold tracking-wide border transition ${
                    slackConnected 
                      ? "border-red-950 bg-red-950/15 text-red-400 hover:bg-red-950/30" 
                      : "border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white"
                  }`}
                >
                  {slackConnected ? "Disconnect" : "Connect"}
                </button>
              </div>

              {/* Google Calendar Connection */}
              <div className="flex items-center justify-between py-1 border-t border-slate-900 pt-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400">
                    <Calendar className="h-4.5 w-4.5 text-blue-500" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-200">Google Calendar</h4>
                      <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-semibold uppercase">active</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Auto-align summaries with calendar events</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setGcalConnected(!gcalConnected);
                    toast.success(gcalConnected ? "Disconnected Google Calendar" : "Connected Google Calendar!");
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold tracking-wide border transition ${
                    gcalConnected 
                      ? "border-red-950 bg-red-950/15 text-red-400 hover:bg-red-950/30" 
                      : "border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white"
                  }`}
                >
                  {gcalConnected ? "Disconnect" : "Connect"}
                </button>
              </div>

              {/* Zoom Connection */}
              <div className="flex items-center justify-between py-1 border-t border-slate-900 pt-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400">
                    <Video className="h-4.5 w-4.5 text-cyan-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-200">Zoom recordings</h4>
                    <p className="text-[10px] text-slate-500">Auto-import cloud recordings after meetings</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setZoomConnected(!zoomConnected);
                    toast.success(zoomConnected ? "Disconnected Zoom" : "Connected Zoom cloud sync!");
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold tracking-wide border transition ${
                    zoomConnected 
                      ? "border-red-950 bg-red-950/15 text-red-400 hover:bg-red-950/30" 
                      : "border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white"
                  }`}
                >
                  {zoomConnected ? "Disconnect" : "Connect"}
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Custom Slack Icon component
function SlackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1-2.52-2.52 2.528 2.528 0 0 1 2.52-2.523 2.528 2.528 0 0 1 2.52 2.523v2.52h-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522H3.78a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.043zm10.135 3.779a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.52h-2.52v-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52H10.13a2.528 2.528 0 0 1-2.52-2.52V3.78a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043zm-3.779 10.135a2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.52-2.523v-2.52h2.52zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522v5.043a2.528 2.528 0 0 1-2.52 2.52H13.917z" />
    </svg>
  );
}
