"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft, RotateCcw } from "lucide-react";
import ResumeUploader from "@/components/ResumeUploader";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import UserContextInput from "@/components/UserContextInput";
import ActionPanel from "@/components/ActionPanel";
import ResultsPanel from "@/components/ResultsPanel";
import { useAppStore } from "@/store";

export default function DashboardPage() {
    const resetSession = useAppStore((s) => s.resetSession);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* ================================================
          Dashboard Header
          ================================================ */}
            <header className="dashboard-header">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Link
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            color: "var(--color-text-muted)",
                            textDecoration: "none",
                            fontSize: "0.85rem",
                            transition: "color var(--transition-fast)",
                            padding: "0.375rem 0.75rem",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border)",
                        }}
                        id="back-home-link"
                    >
                        <ArrowLeft size={14} />
                        Home
                    </Link>

                    <div
                        style={{
                            width: "1px",
                            height: "24px",
                            background: "var(--color-border)",
                        }}
                    />

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Sparkles size={20} color="var(--color-primary-light)" />
                        <span
                            style={{
                                fontSize: "1.125rem",
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                            }}
                            className="gradient-text"
                        >
                            JobPrep AI
                        </span>
                    </div>
                </div>

                <button
                    onClick={resetSession}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-text-muted)",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-border-hover)";
                        e.currentTarget.style.color = "var(--color-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-border)";
                        e.currentTarget.style.color = "var(--color-text-muted)";
                    }}
                    id="reset-session-btn"
                >
                    <RotateCcw size={14} />
                    Reset
                </button>
            </header>

            {/* ================================================
          Split-Screen Dashboard
          ================================================ */}
            <div className="dashboard-layout">
                {/* ---- Left Panel: Inputs ---- */}
                <div className="dashboard-panel animate-slide-up" style={{ opacity: 0 }}>
                    <div className="panel-header">
                        <div
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "var(--color-primary)",
                                boxShadow: "0 0 8px var(--color-primary)",
                            }}
                        />
                        <h2>Your Inputs</h2>
                    </div>

                    <ResumeUploader />
                    <JobDescriptionInput />
                    <UserContextInput />
                    <ActionPanel />
                </div>

                {/* ---- Right Panel: Results ---- */}
                <div className="dashboard-panel animate-slide-up stagger-1" style={{ opacity: 0 }}>
                    <div className="panel-header">
                        <div
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "var(--color-accent)",
                                boxShadow: "0 0 8px var(--color-accent)",
                            }}
                        />
                        <h2>AI Output</h2>
                    </div>

                    <ResultsPanel />
                </div>
            </div>
        </div>
    );
}
