"use client";

import { Briefcase } from "lucide-react";
import { useAppStore } from "@/store";

export default function JobDescriptionInput() {
    const { jobDescription, setJobDescription } = useAppStore();

    return (
        <div>
            <label className="input-label" htmlFor="jd-textarea">
                <Briefcase size={14} />
                Job Description
            </label>

            <textarea
                id="jd-textarea"
                className="textarea-field"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here...&#10;&#10;Include the role title, responsibilities, required skills, qualifications, and any other relevant details from the posting."
                rows={7}
                style={{ minHeight: "140px" }}
            />

            <div className="char-count">
                {jobDescription.length > 0
                    ? `${jobDescription.length.toLocaleString()} characters`
                    : "Paste the complete JD for best results"}
            </div>
        </div>
    );
}
