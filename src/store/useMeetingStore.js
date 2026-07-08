"use client";

import { create } from "zustand";

const initialMeetings = [
  {
    id: "meet-1",
    title: "AI Integration & Architecture Review",
    date: "2026-07-08T10:30:00.000Z",
    duration: "1h 5m 12s",
    durationSeconds: 3912,
    status: "completed",
    category: "workshop",
    speakerCount: 4,
    audioUrl: null,
    summary: {
      overview: "An architectural review focusing on integrating OpenAI/Anthropic APIs into the core service. The team discussed routing, caching strategies, rate limits, and securing client keys.",
      keyTakeaways: [
        "Identified Redis cache as the primary solution to reduce API token costs by caching common semantic queries.",
        "Agreed to implement a fallback queue if OpenAI experiences downtime, routing critical jobs to Anthropic Claude 3.5 Sonnet.",
        "Confirmed client-key storage will use AWS KMS with strict IAM roles, ensuring end-to-end data encryption."
      ],
      actionItems: [
        { id: "act-1-1", text: "Create draft of Redis semantic caching schema", assignee: "Alex (Backend)", completed: true },
        { id: "act-1-2", text: "Configure AWS KMS keys and document security credentials policy", assignee: "Sarah (DevOps)", completed: false },
        { id: "act-1-3", text: "Set up fallback routing logic in the chat proxy service", assignee: "Nikhil (Lead)", completed: false }
      ],
      decisions: [
        "Redis will cache queries for 24 hours.",
        "API error threshold for fallback routing is set to 3 consecutive failures or latency > 8000ms."
      ]
    },
    transcript: [
      { id: "tr-1-1", speaker: "Nikhil", time: "00:15", text: "Welcome everyone. Today we are looking at our AI API integration architecture. The main goals are to make it robust, cut costs, and secure customer keys." },
      { id: "tr-1-2", speaker: "Alex", time: "01:22", text: "Regarding cost, caching is going to be our biggest win. About 35% of user queries are highly repetitive. I suggest using a semantic Redis cache." },
      { id: "tr-1-3", speaker: "Sarah", time: "03:45", text: "That sounds solid, Alex. What about the customer keys? They will be passing keys to use their own models. We must store them securely." },
      { id: "tr-1-4", speaker: "Nikhil", time: "05:10", text: "Yes, Sarah. Let's use AWS KMS. Alex, can you draft the schema for Redis? Sarah, you take AWS KMS configuration." },
      { id: "tr-1-5", speaker: "Jessica", time: "06:30", text: "Should we also have a fallback? If OpenAI goes down, our service shouldn't crash." },
      { id: "tr-1-6", speaker: "Nikhil", time: "07:15", text: "Good point. Let's add Anthropic Claude as a secondary fallback router. If OpenAI fails 3 times in a row, we failover." }
    ]
  },
  {
    id: "meet-2",
    title: "Weekly Marketing Sync & Website Redesign",
    date: "2026-07-07T14:00:00.000Z",
    duration: "24m 45s",
    durationSeconds: 1485,
    status: "completed",
    category: "standup",
    speakerCount: 3,
    audioUrl: null,
    summary: {
      overview: "The marketing and design teams synced on the new website landing page draft. Feedback on the hero section was gathered, and the schedule for launch was aligned.",
      keyTakeaways: [
        "The landing page hero design requires stronger visual cues for the 'Try Free' CTA.",
        "Content marketing needs to prepare 3 blog posts covering AI automation before the launch.",
        "The target launch date is locked for July 20th, 2026."
      ],
      actionItems: [
        { id: "act-2-1", text: "Increase contrast and add micro-interaction to CTA button", assignee: "Elena (UI/UX)", completed: true },
        { id: "act-2-2", text: "Draft 3 launch blogs focusing on time-saving metrics", assignee: "Mark (Content)", completed: true },
        { id: "act-2-3", text: "Review Google Analytics tagging configuration", assignee: "Mark (Content)", completed: false }
      ],
      decisions: [
        "The primary theme color is changed from blue to deep violet for a premium aesthetic.",
        "Launch date is set to Monday, July 20th at 9:00 AM EST."
      ]
    },
    transcript: [
      { id: "tr-2-1", speaker: "Elena", time: "00:10", text: "Here is the new mock for the home page. I went with a glassmorphic design and dark violet tones." },
      { id: "tr-2-2", speaker: "Mark", time: "01:05", text: "This looks stunning, Elena! The contrast on the CTA could be slightly higher though. It needs to jump out." },
      { id: "tr-2-3", speaker: "Elena", time: "02:15", text: "Understood, I will increase the gradient brightness and add a hover scale effect." },
      { id: "tr-2-4", speaker: "Mark", time: "03:00", text: "Awesome. I am also working on the blogs. Will have them drafted by Friday." }
    ]
  },
  {
    id: "meet-3",
    title: "Sprint Retro & Q3 Planning",
    date: "2026-07-06T09:00:00.000Z",
    duration: "45m 10s",
    durationSeconds: 2710,
    status: "completed",
    category: "general",
    speakerCount: 5,
    audioUrl: null,
    summary: {
      overview: "A retrospective of Sprint 12 and alignment on Q3 core engineering objectives. The team discussed velocity drops due to test failures and outlined migration to Next.js 16.",
      keyTakeaways: [
        "Sprint velocity dropped by 15% due to flaky unit tests in the authentication pipeline.",
        "The migration to Next.js 16 is approved to resolve build performance bottlenecks.",
        "We will dedicate 20% of the next sprint to technical debt and test refactoring."
      ],
      actionItems: [
        { id: "act-3-1", text: "Isolate and refactor flaky Auth test suite", assignee: "Devon (QA)", completed: true },
        { id: "act-3-2", text: "Create migration plan and branch for Next.js 16 upgrade", assignee: "Nikhil (Lead)", completed: true },
        { id: "act-3-3", text: "Set up Cypress automated regression tests in GitHub Actions", assignee: "Sarah (DevOps)", completed: false }
      ],
      decisions: [
        "No new major features will be committed in Sprint 13 until CI test pass rate is consistently at 100%.",
        "Next.js 16 branch will be merged during the mid-sprint maintenance window."
      ]
    },
    transcript: [
      { id: "tr-3-1", speaker: "Nikhil", time: "00:20", text: "Let's review our retro. Our velocity was down. What happened?" },
      { id: "tr-3-2", speaker: "Devon", time: "01:10", text: "We had a lot of failures in CI related to auth tokens. They are flaky and caused rebuilds." },
      { id: "tr-3-3", speaker: "Sarah", time: "02:40", text: "I agree, we spent too much time debug-rebuilding. We need to stabilize them before we add more features." }
    ]
  },
  {
    id: "meet-4",
    title: "Senior Product Designer Interview",
    date: "2026-07-05T15:00:00.000Z",
    duration: "30m 0s",
    durationSeconds: 1800,
    status: "completed",
    category: "interview",
    speakerCount: 2,
    audioUrl: null,
    summary: {
      overview: "An interview with candidate Daniel Vance for the Senior Product Designer role. Daniel presented his portfolio of dashboards and completed a design challenge.",
      keyTakeaways: [
        "Daniel demonstrated strong systems thinking and expertise in building complex, accessible layouts.",
        "He has extensive experience with Tailwind and Framer Motion.",
        "His culture fit was positive, showing high empathy and collaborative values."
      ],
      actionItems: [
        { id: "act-4-1", text: "Send portfolio feedback link to stakeholders", assignee: "Recruiting", completed: true },
        { id: "act-4-2", text: "Schedule a technical-fit interview with engineering lead", assignee: "Recruiting", completed: true },
        { id: "act-4-3", text: "Submit final recommendation scorecard", assignee: "Elena (UI/UX)", completed: true }
      ],
      decisions: [
        "Daniel will proceed to the final round interview."
      ]
    },
    transcript: [
      { id: "tr-4-1", speaker: "Elena", time: "00:05", text: "Hi Daniel, thanks for joining us. Can you tell us about your experience designing dashboards?" },
      { id: "tr-4-2", speaker: "Daniel", time: "00:45", text: "Sure! Over the past 4 years, I've focused on SaaS products, creating customized design systems and data-rich visualizations." }
    ]
  },
  {
    id: "meet-5",
    title: "Quarterly Financial Review",
    date: "2026-07-04T11:00:00.000Z",
    duration: "58m 0s",
    durationSeconds: 3480,
    status: "failed",
    category: "workshop",
    speakerCount: 1,
    audioUrl: null,
    summary: null,
    transcript: null
  }
];

export const useMeetingStore = create((set, get) => ({
  meetings: initialMeetings,
  activeUploads: [],
  selectedMeetingId: "meet-1",
  chatHistory: [
    {
      id: "ch-1",
      sender: "ai",
      text: "Hello! I can answer questions about any of your processed meetings. Select a meeting on the left to begin, or ask a general query.",
      time: "2026-07-08T10:45:00.000Z"
    }
  ],

  // Actions
  setSelectedMeetingId: (id) => set({ selectedMeetingId: id }),

  addMeeting: (meeting) => set((state) => ({
    meetings: [meeting, ...state.meetings]
  })),

  deleteMeeting: (id) => set((state) => ({
    meetings: state.meetings.filter((m) => m.id !== id),
    selectedMeetingId: state.selectedMeetingId === id 
      ? (state.meetings.find((m) => m.id !== id)?.id || null)
      : state.selectedMeetingId
  })),

  toggleActionItem: (meetingId, actionItemId) => set((state) => ({
    meetings: state.meetings.map((m) => {
      if (m.id !== meetingId) return m;
      return {
        ...m,
        summary: {
          ...m.summary,
          actionItems: m.summary.actionItems.map((item) => 
            item.id === actionItemId ? { ...item, completed: !item.completed } : item
          )
        }
      };
    })
  })),

  addChatMessage: (msg) => set((state) => ({
    chatHistory: [...state.chatHistory, msg]
  })),

  // File upload simulator
  simulateUpload: (fileName, fileSize, options = {}) => {
    const uploadId = `upl-${Date.now()}`;
    const newUpload = {
      id: uploadId,
      name: fileName,
      size: fileSize,
      progress: 0,
      phase: "uploading" // uploading | transcribing | summarizing | completed
    };

    set((state) => ({
      activeUploads: [...state.activeUploads, newUpload]
    }));

    // Start timer progression
    let currentProgress = 0;
    const interval = setInterval(() => {
      const state = get();
      const currentUpload = state.activeUploads.find(u => u.id === uploadId);
      if (!currentUpload) {
        clearInterval(interval);
        return;
      }

      currentProgress += 5;

      let nextPhase = currentUpload.phase;
      if (currentProgress < 30) {
        nextPhase = "uploading";
      } else if (currentProgress < 70) {
        nextPhase = "transcribing";
      } else if (currentProgress < 95) {
        nextPhase = "summarizing";
      } else {
        nextPhase = "completed";
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Remove from active uploads
        set((state) => ({
          activeUploads: state.activeUploads.filter(u => u.id !== uploadId)
        }));

        // Create completed meeting
        const durationSec = Math.floor(Math.random() * 2000) + 600;
        const durationMin = Math.floor(durationSec / 60);
        const durationRemSec = durationSec % 60;
        const durationStr = `${durationMin}m ${durationRemSec}s`;

        const newMeetingId = `meet-${Date.now()}`;
        const finalMeeting = {
          id: newMeetingId,
          title: fileName.replace(/\.[^/.]+$/, ""), // Strip extension
          date: new Date().toISOString(),
          duration: durationStr,
          durationSeconds: durationSec,
          status: "completed",
          category: options.category || "general",
          speakerCount: options.speakers || 2,
          audioUrl: null,
          summary: {
            overview: `This is an AI-generated summary of the meeting recording '${fileName}'. The discussion focused on core requirements, development timelines, and integration tasks.`,
            keyTakeaways: [
              "Aligned team objectives and milestone deadlines.",
              "Identified blocker in third-party API stability.",
              "Reviewed UX suggestions for custom dashboard widgets."
            ],
            actionItems: [
              { id: `act-${newMeetingId}-1`, text: "Verify API endpoints using Postman environment variables", assignee: "Developer", completed: false },
              { id: `act-${newMeetingId}-2`, text: "Refine landing page spacing in mobile responsive screens", assignee: "Designer", completed: false },
              { id: `act-${newMeetingId}-3`, text: "Set up team sync to iron out technical deployment scripts", assignee: "Manager", completed: false }
            ],
            decisions: [
              "Approved design layout mockups with modern gradients.",
              "Deployment scheduled for next Tuesday."
            ]
          },
          transcript: [
            { id: `tr-${newMeetingId}-1`, speaker: "Speaker 1", time: "00:00", text: "Hello, let's start the recording and begin reviewing the project specs." },
            { id: `tr-${newMeetingId}-2`, speaker: "Speaker 2", time: "00:30", text: "Sure, the primary blocker right now is the unstable third-party API. We need to handle exceptions gracefully." },
            { id: `tr-${newMeetingId}-3`, speaker: "Speaker 1", time: "01:15", text: "Agree. Let's write robust error handling middleware and verify all our routes." }
          ]
        };

        // Add to meetings list
        set((state) => ({
          meetings: [finalMeeting, ...state.meetings],
          selectedMeetingId: newMeetingId
        }));
      } else {
        // Update progress
        set((state) => ({
          activeUploads: state.activeUploads.map(u => 
            u.id === uploadId ? { ...u, progress: currentProgress, phase: nextPhase } : u
          )
        }));
      }
    }, 250);
  }
}));
