"use client";

import { FileText, ClipboardList } from "lucide-react";
import { useAppStore } from "@/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ActionPanel() {
    const {
        isInputComplete,
        isGeneratingResume,
        isGeneratingPlan,
        setIsGeneratingResume,
        setIsGeneratingPlan,
        setOptimizedResumeLaTeX,
        resumeFile,
        jobDescription,
        userContext,
    } = useAppStore();

    const allReady = isInputComplete();
    const anyLoading = isGeneratingResume || isGeneratingPlan;

    const handleUpdateResume = async () => {
        if (!allReady || anyLoading || !resumeFile) return;
        setIsGeneratingResume(true);
        setOptimizedResumeLaTeX(null); // Clear previous result

        try {
            const formData = new FormData();
            formData.append("resume_file", resumeFile);
            formData.append("job_description", jobDescription);
            formData.append("user_instructions", userContext);

            const response = await fetch(`${API_URL}/api/update-resume`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMsg =
                    errorData?.detail ||
                    `Server error (${response.status})`;
                throw new Error(errorMsg);
            }

            const data = await response.json();
            setOptimizedResumeLaTeX(data.latex);
        } catch (error) {
            const msg =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred.";
            alert(`Resume update failed: ${msg}`);
        } finally {
            setIsGeneratingResume(false);
        }
    };

    const handleGeneratePlan = async () => {
        if (!allReady || anyLoading) return;
        setIsGeneratingPlan(true);

        // TODO: Wire to backend API in Phase 4
        setTimeout(() => {
            setIsGeneratingPlan(false);
        }, 3000);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                paddingTop: "0.5rem",
            }}
        >
            {/* Validation hint */}
            {!allReady && (
                <div
                    style={{
                        fontSize: "0.8rem",
                        color: "var(--color-text-muted)",
                        textAlign: "center",
                        padding: "0.5rem",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--color-bg-glass)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    ✦ Fill in all three fields above to enable actions
                </div>
            )}

            {/* Update Resume Button */}
            <button
                className="btn-action btn-action-resume"
                disabled={!allReady || anyLoading}
                onClick={handleUpdateResume}
                id="update-resume-btn"
            >
                {isGeneratingResume ? (
                    <>
                        <div className="spinner" />
                        Optimizing Resume...
                    </>
                ) : (
                    <>
                        <FileText size={18} />
                        Update Resume
                    </>
                )}
            </button>

            {/* Generate Prep Plan Button */}
            <button
                className="btn-action btn-action-plan"
                disabled={!allReady || anyLoading}
                onClick={handleGeneratePlan}
                id="generate-plan-btn"
            >
                {isGeneratingPlan ? (
                    <>
                        <div className="spinner" />
                        Generating Plan...
                    </>
                ) : (
                    <>
                        <ClipboardList size={18} />
                        Generate Prep Plan
                    </>
                )}
            </button>
        </div>
    );
}
