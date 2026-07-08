"use client";

import { useState, useRef, useEffect } from "react";
import { useMeetingStore } from "@/store/useMeetingStore";
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare, 
  CheckCircle, 
  User, 
  Plus, 
  HelpCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ChatPage() {
  const { meetings, chatHistory, addChatMessage } = useMeetingStore();
  
  // Set selected meetings for chat context
  const [selectedContextIds, setSelectedContextIds] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Set default context to the first completed meeting if available
  useEffect(() => {
    const completed = meetings.find(m => m.status === "completed");
    if (completed && selectedContextIds.length === 0) {
      setSelectedContextIds([completed.id]);
    }
  }, [meetings, selectedContextIds]);

  const handleToggleContext = (id) => {
    setSelectedContextIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSendMessage = (textToSend = inputValue) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsgId = `ch-user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      time: new Date().toISOString()
    };
    addChatMessage(userMsg);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response based on selected context
    setTimeout(() => {
      setIsTyping(false);

      const selectedMeetings = meetings.filter(m => selectedContextIds.includes(m.id));
      let aiResponseText = "";

      if (selectedMeetings.length === 0) {
        aiResponseText = "Please select at least one meeting on the left so I can answer questions using its context. Otherwise, I don't have access to the transcripts!";
      } else {
        const query = textToSend.toLowerCase();
        
        // Generate customized responses based on meeting contents
        if (query.includes("action item") || query.includes("tasks") || query.includes("to do")) {
          const items = selectedMeetings.flatMap(m => 
            m.summary?.actionItems.map(item => `- **${item.text}** (Assigned to: *${item.assignee}*) [from: *${m.title}*]`) || []
          );
          aiResponseText = items.length > 0 
            ? `Here are the action items I found in the selected meetings:\n\n${items.join("\n")}`
            : "I couldn't find any pending action items in these meetings.";
        } 
        else if (query.includes("decision") || query.includes("decided") || query.includes("approve")) {
          const items = selectedMeetings.flatMap(m => 
            m.summary?.decisions.map(item => `- **${item}** [from: *${m.title}*]`) || []
          );
          aiResponseText = items.length > 0 
            ? `Here are the core decisions that were agreed upon:\n\n${items.join("\n")}`
            : "No specific decisions were noted in the summary for these sessions.";
        }
        else if (query.includes("redis") || query.includes("caching") || query.includes("alex")) {
          const arcReview = selectedMeetings.find(m => m.id === "meet-1");
          if (arcReview) {
            aiResponseText = "During the **Architecture Review**, Alex suggested utilizing a **semantic Redis cache** to store user queries. He noted that about **35% of user queries are highly repetitive**, meaning caching could significantly reduce OpenAI API token costs. The team decided to cache queries for 24 hours.";
          } else {
            aiResponseText = "I found mention of Redis caching in the 'AI Integration & Architecture Review' meeting. Please check the checkbox next to it on the left so I can read that transcript!";
          }
        }
        else if (query.includes("marketing") || query.includes("launch") || query.includes("elena") || query.includes("website")) {
          const mktSync = selectedMeetings.find(m => m.id === "meet-2");
          if (mktSync) {
            aiResponseText = "In the **Marketing Sync**, Elena presented the landing page redesign mockup using a dark violet theme and glassmorphic aesthetics. Mark recommended increasing the hero section CTA ('Try Free') contrast to make it pop. Elena agreed to increase the gradient brightness and add a hover scale effect. The target website launch date is locked for **Monday, July 20th at 9:00 AM EST**.";
          } else {
            aiResponseText = "Marketing launch details are in the 'Weekly Marketing Sync' meeting. Please check it in the context list on the left.";
          }
        }
        else if (query.includes("failover") || query.includes("fallback") || query.includes("openai") || query.includes("anthropic")) {
          const arcReview = selectedMeetings.find(m => m.id === "meet-1");
          if (arcReview) {
            aiResponseText = "The team decided to set up **Anthropic Claude 3.5 Sonnet** as a secondary failover model. If OpenAI API experiences 3 consecutive failures or latency exceeds 8000ms, the system will fallback route critical jobs to Anthropic Claude to ensure uptime.";
          } else {
            aiResponseText = "Failover failover policies are discussed in the 'AI Integration & Architecture Review'. Please check it on the left panel.";
          }
        }
        else {
          // General fallback smart summary
          const titles = selectedMeetings.map(m => m.title).join(", ");
          aiResponseText = `I am analyzing the transcripts for **${titles}**. Based on the discussion, the team focused on aligning priorities and scheduling next steps. Let me know if you would like me to extract:
- **Action items** and assignees
- **Decisions** made during these sessions
- Details about specific topics like caching, design mockups, or API fallbacks.`;
        }
      }

      const aiMsg = {
        id: `ch-ai-${Date.now()}`,
        sender: "ai",
        text: aiResponseText,
        time: new Date().toISOString()
      };
      addChatMessage(aiMsg);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Preset chips
  const suggestions = [
    "What action items were assigned?",
    "What did Alex suggest about caching?",
    "Summarize website launch plans",
    "What decisions were made?"
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">AI Assistant Chat</h1>
        <p className="text-xs text-slate-500">Ask questions across multiple meetings and extract summary reports</p>
      </div>

      {/* Split Window */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0 items-stretch">
        
        {/* Left Side: Context Selector (4 Columns) */}
        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-5 flex flex-col space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Chat Context</h3>
            <p className="text-[10px] text-slate-500">Choose which meetings the AI assistant should reference</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {meetings.filter(m => m.status === "completed").map((meet) => {
              const isChecked = selectedContextIds.includes(meet.id);

              return (
                <div
                  key={meet.id}
                  onClick={() => handleToggleContext(meet.id)}
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-2xl border transition-all duration-200 ${
                    isChecked
                      ? "bg-slate-900/60 border-blue-500/30 shadow-inner"
                      : "bg-slate-950/20 border-slate-950 hover:bg-slate-900/20 hover:border-slate-900"
                  }`}
                >
                  <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition ${
                    isChecked 
                      ? "border-blue-500 bg-blue-600 text-white" 
                      : "border-slate-800 bg-slate-950/50"
                  }`}>
                    {isChecked && <CheckCircle className="h-3 w-3" />}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-xs font-bold text-slate-200 truncate">{meet.title}</p>
                    <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                      {meet.category} • {new Date(meet.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedContextIds.length === 0 && (
            <div className="rounded-2xl border border-amber-900/30 bg-amber-950/10 p-3 flex gap-2 text-amber-500 text-[10px] leading-relaxed">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>No meetings selected. The AI will not have access to any transcripts.</span>
            </div>
          )}
        </div>

        {/* Right Side: Conversation Area (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-900/10 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-900 bg-slate-900/20 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow shadow-blue-500/10">
              <Bot className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">MeetMind AI Copilot</h4>
              <p className="text-[10px] text-slate-400">
                Referencing {selectedContextIds.length} {selectedContextIds.length === 1 ? 'meeting' : 'meetings'}
              </p>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-340px)]">
            {chatHistory.map((msg) => {
              const isAI = msg.sender === "ai";
              
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border ${
                    isAI
                      ? "bg-slate-950 border-slate-900 text-blue-400"
                      : "bg-blue-600 border-blue-500 text-white shadow shadow-blue-500/10"
                  }`}>
                    {isAI ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-inner ${
                      isAI
                        ? "bg-slate-900/30 border border-slate-900 text-slate-200"
                        : "bg-slate-900 border border-slate-800 text-slate-100"
                    }`}>
                      {/* Render markdown style linebreaks */}
                      {msg.text.split("\n").map((line, i) => (
                        <p key={i} className={line === "" ? "h-2" : "mb-1"}>
                          {/* Crude bold renderer */}
                          {line.split("**").map((chunk, j) => 
                            j % 2 === 1 ? <strong key={j} className="text-white font-bold">{chunk}</strong> : chunk
                          )}
                        </p>
                      ))}
                    </div>
                    <p className={`text-[9px] text-slate-500 px-1 ${isAI ? "text-left" : "text-right"}`}>
                      {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 mr-auto max-w-[80%]">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border bg-slate-950 border-slate-900 text-blue-400">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="bg-slate-900/30 border border-slate-900 rounded-2xl px-4 py-3.5 flex items-center gap-1.5 shadow-inner">
                  <div className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                  <div className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt chips suggestions */}
          <div className="px-6 py-2 bg-slate-900/5 flex flex-wrap gap-1.5 border-t border-slate-900/30">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="text-[10px] text-slate-400 hover:text-white hover:border-slate-700 bg-slate-950/20 hover:bg-slate-900/40 border border-slate-900 px-3 py-1.5 rounded-lg transition"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Form inputs */}
          <div className="p-4 border-t border-slate-900 bg-slate-900/20 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question about the selected meetings..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition shadow-inner"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="inline-flex h-10.5 w-10.5 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed transition shadow-lg shadow-blue-500/10"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
