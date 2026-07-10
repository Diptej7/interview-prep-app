"use client";

import { useState } from "react";
import { Sparkles, FileText, ClipboardList, Copy, Check, Download, ExternalLink } from "lucide-react";
import { useAppStore } from "@/store";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function SkeletonLoader() {
    return (
        <div style={{ padding: "1.5rem" }}>
            <div className="skeleton skeleton-block" />
            <div className="skeleton skeleton-line" style={{ width: "90%" }} />
            <div className="skeleton skeleton-line" style={{ width: "75%" }} />
            <div className="skeleton skeleton-line" style={{ width: "85%" }} />
            <div className="skeleton skeleton-line" style={{ width: "60%" }} />
            <div style={{ height: "1.5rem" }} />
            <div className="skeleton skeleton-block" style={{ height: "60px" }} />
            <div className="skeleton skeleton-line" style={{ width: "70%" }} />
            <div className="skeleton skeleton-line" style={{ width: "80%" }} />
        </div>
    );
}

function EmptyState() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "3rem 2rem",
                minHeight: "400px",
                gap: "1.25rem",
            }}
        >
            {/* Animated icon cluster */}
            <div
                style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    marginBottom: "0.5rem",
                }}
            >
                <div
                    className="animate-float"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background:
                            "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.08) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Sparkles size={32} color="var(--color-primary-light)" />
                </div>
                <div
                    className="animate-float stagger-2"
                    style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(99,102,241,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <FileText size={14} color="var(--color-primary)" />
                </div>
                <div
                    className="animate-float stagger-3"
                    style={{
                        position: "absolute",
                        bottom: "2px",
                        left: "2px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "rgba(6,182,212,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ClipboardList size={12} color="var(--color-accent)" />
                </div>
            </div>

            <div>
                <h3
                    style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                        letterSpacing: "-0.01em",
                    }}
                >
                    Results will appear here
                </h3>
                <p
                    style={{
                        color: "var(--color-text-muted)",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        maxWidth: "360px",
                    }}
                >
                    Upload your resume, paste a job description, add your context, then
                    hit one of the action buttons to get started.
                </p>
            </div>

            {/* Step indicators */}
            <div
                style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                }}
            >
                {["Resume", "Job Desc", "Context", "Go!"].map((step, i) => (
                    <div
                        key={step}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            padding: "0.375rem 0.75rem",
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            background: "var(--color-bg-glass)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-muted)",
                        }}
                    >
                        <span
                            style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: "var(--color-bg-tertiary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                            }}
                        >
                            {i + 1}
                        </span>
                        {step}
                    </div>
                ))}
            </div>
        </div>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            id="copy-latex-btn"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: copied
                    ? "rgba(16, 185, 129, 0.1)"
                    : "var(--color-bg-glass)",
                color: copied
                    ? "var(--color-success)"
                    : "var(--color-text-secondary)",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
            }}
        >
            {copied ? (
                <>
                    <Check size={14} />
                    Copied!
                </>
            ) : (
                <>
                    <Copy size={14} />
                    Copy LaTeX
                </>
            )}
        </button>
    );
}

function LaTeXResult({ latex }: { latex: string }) {
    const {
        cachedPdfBlob,
        setCachedPdfBlob,
        isCompilingPdf,
        setIsCompilingPdf,
    } = useAppStore();

    const [downloadError, setDownloadError] = useState<string | null>(null);

    const handleDownloadPdf = async () => {
        setDownloadError(null);

        // Use cached blob if available
        if (cachedPdfBlob) {
            triggerDownload(cachedPdfBlob);
            return;
        }

        setIsCompilingPdf(true);
        try {
            const API_URL =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${API_URL}/api/compile-resume`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latex }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const msg =
                    errorData?.detail?.message ||
                    errorData?.detail ||
                    `Compilation failed (${response.status})`;
                throw new Error(
                    typeof msg === "object" ? JSON.stringify(msg) : msg
                );
            }

            const blob = await response.blob();
            setCachedPdfBlob(blob);
            triggerDownload(blob);
        } catch (error) {
            const msg =
                error instanceof Error ? error.message : "Unexpected error";
            setDownloadError(msg);
        } finally {
            setIsCompilingPdf(false);
        }
    };

    const triggerDownload = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "optimized_resume.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleOpenInOverleaf = () => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://www.overleaf.com/docs";
        form.target = "_blank";

        const snipInput = document.createElement("input");
        snipInput.type = "hidden";
        snipInput.name = "snip_uri";

        // Overleaf expects base64-encoded content in a data URI
        const encoded = btoa(unescape(encodeURIComponent(latex)));
        snipInput.value = `data:application/x-tex;base64,${encoded}`;

        form.appendChild(snipInput);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    return (
        <div>
            {/* Header row */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                }}
            >
                <h3
                    style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <FileText size={16} color="var(--color-primary)" />
                    Optimized Resume (LaTeX)
                </h3>
            </div>

            {/* Action toolbar */}
            <div
                style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                    flexWrap: "wrap",
                }}
            >
                <CopyButton text={latex} />

                <button
                    onClick={handleDownloadPdf}
                    disabled={isCompilingPdf}
                    id="download-pdf-btn"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-border)",
                        background: isCompilingPdf
                            ? "var(--color-bg-tertiary)"
                            : "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))",
                        color: isCompilingPdf
                            ? "var(--color-text-muted)"
                            : "var(--color-primary-light)",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor: isCompilingPdf ? "wait" : "pointer",
                        transition: "all var(--transition-fast)",
                    }}
                >
                    {isCompilingPdf ? (
                        <>
                            <div
                                className="spinner"
                                style={{ width: "14px", height: "14px" }}
                            />
                            Compiling...
                        </>
                    ) : (
                        <>
                            <Download size={14} />
                            {cachedPdfBlob ? "Download PDF ✓" : "Download PDF"}
                        </>
                    )}
                </button>

                <button
                    onClick={handleOpenInOverleaf}
                    id="open-overleaf-btn"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-border)",
                        background:
                            "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.05))",
                        color: "var(--color-accent)",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all var(--transition-fast)",
                    }}
                >
                    <ExternalLink size={14} />
                    Open in Overleaf
                </button>
            </div>

            {/* Error message */}
            {downloadError && (
                <div
                    style={{
                        padding: "0.75rem 1rem",
                        marginBottom: "0.75rem",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#f87171",
                        fontSize: "0.8rem",
                        lineHeight: 1.5,
                    }}
                >
                    ⚠ PDF compilation failed: {downloadError}
                    <br />
                    <span style={{ color: "var(--color-text-muted)" }}>
                        You can use &quot;Open in Overleaf&quot; to compile and edit
                        manually.
                    </span>
                </div>
            )}

            {/* Syntax-highlighted code */}
            <div
                style={{
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--color-border)",
                    maxHeight: "600px",
                    overflowY: "auto",
                }}
            >
                <SyntaxHighlighter
                    language="latex"
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "1.25rem",
                        fontSize: "0.8rem",
                        lineHeight: 1.6,
                        background: "var(--color-bg-tertiary)",
                    }}
                    showLineNumbers
                    lineNumberStyle={{
                        color: "rgba(255,255,255,0.15)",
                        fontSize: "0.7rem",
                        minWidth: "2.5em",
                    }}
                >
                    {latex}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}


export default function ResultsPanel() {
    const {
        isGeneratingResume,
        isGeneratingPlan,
        optimizedResumeLaTeX,
        currentPlan,
    } = useAppStore();

    const isLoading = isGeneratingResume || isGeneratingPlan;
    const hasResults = optimizedResumeLaTeX || currentPlan;

    return (
        <div
            className="glass-card"
            style={{
                flex: 1,
                overflow: "hidden",
                minHeight: "500px",
            }}
        >
            {/* Panel Header */}
            <div
                style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                <Sparkles size={16} color="var(--color-primary-light)" />
                <h2
                    style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                    }}
                >
                    AI Results
                </h2>
                {isLoading && (
                    <div
                        style={{
                            marginLeft: "auto",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.8rem",
                            color: "var(--color-primary-light)",
                        }}
                    >
                        <div className="spinner" style={{ width: "14px", height: "14px" }} />
                        Processing...
                    </div>
                )}
            </div>

            {/* Content Area */}
            {isLoading ? (
                <SkeletonLoader />
            ) : hasResults ? (
                <div style={{ padding: "1.5rem" }}>
                    {optimizedResumeLaTeX && (
                        <LaTeXResult latex={optimizedResumeLaTeX} />
                    )}
                    {currentPlan && (
                        <div>
                            <h3
                                style={{
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    marginBottom: "0.75rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                }}
                            >
                                <ClipboardList size={16} color="var(--color-accent)" />
                                Preparation Plan
                            </h3>
                            <p style={{ color: "var(--color-text-secondary)" }}>
                                Plan content will render here in Phase 4.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <EmptyState />
            )}
        </div>
    );
}
