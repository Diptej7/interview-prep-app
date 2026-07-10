import { create } from "zustand";

// ============================================
// JobPrep AI — Global State Store
// ============================================

export type TopicStatus = "not_started" | "in_progress" | "completed";

export interface TopicProgress {
    topicKey: string;
    title: string;
    status: TopicStatus;
}

export interface PrepPlan {
    id: string;
    sessionId: string;
    topics: TopicProgress[];
    createdAt: string;
}

export interface PrepSession {
    id: string;
    jobDescription: string;
    userContext: string;
    createdAt: string;
}

export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
}

interface AppState {
    // User
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;

    // Current session
    currentSession: PrepSession | null;
    setCurrentSession: (session: PrepSession | null) => void;

    // ============================================
    // Dashboard Inputs (in-memory only)
    // ============================================

    // Resume file (raw File object — never persisted)
    resumeFile: File | null;
    resumeFileName: string | null;
    setResumeFile: (file: File | null) => void;
    clearResumeFile: () => void;

    // Resume text (extracted by backend — in-memory only)
    resumeText: string | null;
    setResumeText: (text: string | null) => void;

    // Job Description input
    jobDescription: string;
    setJobDescription: (jd: string) => void;

    // User Context input
    userContext: string;
    setUserContext: (ctx: string) => void;

    // Computed: are all inputs present?
    isInputComplete: () => boolean;

    // ============================================
    // Agent Outputs
    // ============================================

    // Optimized resume LaTeX output
    optimizedResumeLaTeX: string | null;
    setOptimizedResumeLaTeX: (latex: string | null) => void;

    // Prep plan
    currentPlan: PrepPlan | null;
    setCurrentPlan: (plan: PrepPlan | null) => void;

    // Topic progress
    updateTopicStatus: (topicKey: string, status: TopicStatus) => void;

    // Deep dive content
    deepDiveContent: Record<string, string>;
    setDeepDiveContent: (topicKey: string, content: string) => void;

    // ============================================
    // Loading States
    // ============================================
    isGeneratingResume: boolean;
    setIsGeneratingResume: (loading: boolean) => void;
    isGeneratingPlan: boolean;
    setIsGeneratingPlan: (loading: boolean) => void;
    isLoadingDeepDive: boolean;
    setIsLoadingDeepDive: (loading: boolean) => void;
    isCompilingPdf: boolean;
    setIsCompilingPdf: (loading: boolean) => void;

    // Frontend PDF cache
    cachedPdfBlob: Blob | null;
    setCachedPdfBlob: (blob: Blob | null) => void;

    // Reset
    resetSession: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    // User
    user: null,
    setUser: (user) => set({ user }),

    // Session
    currentSession: null,
    setCurrentSession: (session) => set({ currentSession: session }),

    // ============================================
    // Dashboard Inputs
    // ============================================

    // Resume file (in-memory only)
    resumeFile: null,
    resumeFileName: null,
    setResumeFile: (file) =>
        set({
            resumeFile: file,
            resumeFileName: file ? file.name : null,
        }),
    clearResumeFile: () =>
        set({
            resumeFile: null,
            resumeFileName: null,
        }),

    // Resume text (extracted)
    resumeText: null,
    setResumeText: (text) => set({ resumeText: text }),

    // Job Description
    jobDescription: "",
    setJobDescription: (jd) => set({ jobDescription: jd }),

    // User Context
    userContext: "",
    setUserContext: (ctx) => set({ userContext: ctx }),

    // Computed — checks all three inputs are present
    isInputComplete: () => {
        const state = get();
        return (
            state.resumeFile !== null &&
            state.jobDescription.trim().length > 0 &&
            state.userContext.trim().length > 0
        );
    },

    // ============================================
    // Agent Outputs
    // ============================================

    // Optimized LaTeX
    optimizedResumeLaTeX: null,
    setOptimizedResumeLaTeX: (latex) => set({ optimizedResumeLaTeX: latex, cachedPdfBlob: null }),

    // Prep plan
    currentPlan: null,
    setCurrentPlan: (plan) => set({ currentPlan: plan }),

    // Topic progress
    updateTopicStatus: (topicKey, status) =>
        set((state) => {
            if (!state.currentPlan) return state;
            return {
                currentPlan: {
                    ...state.currentPlan,
                    topics: state.currentPlan.topics.map((topic) =>
                        topic.topicKey === topicKey ? { ...topic, status } : topic
                    ),
                },
            };
        }),

    // Deep dive content
    deepDiveContent: {},
    setDeepDiveContent: (topicKey, content) =>
        set((state) => ({
            deepDiveContent: { ...state.deepDiveContent, [topicKey]: content },
        })),

    // ============================================
    // Loading States
    // ============================================
    isGeneratingResume: false,
    setIsGeneratingResume: (loading) => set({ isGeneratingResume: loading }),
    isGeneratingPlan: false,
    setIsGeneratingPlan: (loading) => set({ isGeneratingPlan: loading }),
    isLoadingDeepDive: false,
    setIsLoadingDeepDive: (loading) => set({ isLoadingDeepDive: loading }),
    isCompilingPdf: false,
    setIsCompilingPdf: (loading) => set({ isCompilingPdf: loading }),

    // Frontend PDF cache
    cachedPdfBlob: null,
    setCachedPdfBlob: (blob) => set({ cachedPdfBlob: blob }),

    // Reset
    resetSession: () =>
        set({
            currentSession: null,
            resumeFile: null,
            resumeFileName: null,
            resumeText: null,
            jobDescription: "",
            userContext: "",
            optimizedResumeLaTeX: null,
            currentPlan: null,
            deepDiveContent: {},
            cachedPdfBlob: null,
        }),
}));
