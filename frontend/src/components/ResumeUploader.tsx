"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { useAppStore } from "@/store";

export default function ResumeUploader() {
    const { resumeFile, resumeFileName, setResumeFile, clearResumeFile } =
        useAppStore();
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (file: File) => {
            if (file.type !== "application/pdf") {
                alert("Only PDF files are accepted.");
                return;
            }
            setResumeFile(file);
        },
        [setResumeFile]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(false);

            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            // Reset input so the same file can be re-selected
            if (inputRef.current) inputRef.current.value = "";
        },
        [handleFile]
    );

    const handleRemove = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            clearResumeFile();
        },
        [clearResumeFile]
    );

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    const dropzoneClass = [
        "dropzone",
        isDragActive && "dropzone-active",
        resumeFile && "dropzone-has-file",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div>
            <label className="input-label">
                <FileText size={14} />
                Resume (PDF)
            </label>

            <div
                className={dropzoneClass}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current?.click()}
                id="resume-dropzone"
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                    id="resume-file-input"
                />

                {resumeFile ? (
                    /* ---- File Selected State ---- */
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.875rem",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "var(--radius-sm)",
                                background: "rgba(16, 185, 129, 0.12)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <CheckCircle size={22} color="var(--color-success)" />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {resumeFileName}
                            </div>
                            <div
                                style={{
                                    fontSize: "0.75rem",
                                    color: "var(--color-text-muted)",
                                    marginTop: "2px",
                                }}
                            >
                                {formatSize(resumeFile.size)} · PDF · Ready to process
                            </div>
                        </div>

                        <button
                            onClick={handleRemove}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "var(--radius-sm)",
                                border: "1px solid var(--color-border)",
                                background: "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all var(--transition-fast)",
                                flexShrink: 0,
                                color: "var(--color-text-muted)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-error)";
                                e.currentTarget.style.color = "var(--color-error)";
                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-border)";
                                e.currentTarget.style.color = "var(--color-text-muted)";
                                e.currentTarget.style.background = "transparent";
                            }}
                            id="resume-remove-btn"
                            title="Remove file"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    /* ---- Empty State ---- */
                    <>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                background: "rgba(99, 102, 241, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Upload
                                size={22}
                                color={
                                    isDragActive
                                        ? "var(--color-primary)"
                                        : "var(--color-text-muted)"
                                }
                            />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                                {isDragActive ? (
                                    <span style={{ color: "var(--color-primary-light)" }}>
                                        Drop your PDF here
                                    </span>
                                ) : (
                                    "Drag & drop your resume PDF"
                                )}
                            </div>
                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    color: "var(--color-text-muted)",
                                    marginTop: "4px",
                                }}
                            >
                                or click to browse · PDF only
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
