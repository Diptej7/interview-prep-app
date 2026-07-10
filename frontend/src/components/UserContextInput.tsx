"use client";

import { MessageSquare } from "lucide-react";
import { useAppStore } from "@/store";

export default function UserContextInput() {
    const { userContext, setUserContext } = useAppStore();

    return (
        <div>
            <label className="input-label" htmlFor="context-textarea">
                <MessageSquare size={14} />
                Your Context / Instructions
            </label>

            <textarea
                id="context-textarea"
                className="textarea-field"
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                placeholder='Add any specific instructions or context...&#10;&#10;Examples:&#10;• "Focus on my Python and cloud experience"&#10;• "I have 3 years of experience, targeting senior role"&#10;• "Emphasize my leadership and cross-team collaboration"'
                rows={4}
                style={{ minHeight: "100px" }}
            />

            <div className="char-count">
                {userContext.length > 0
                    ? `${userContext.length.toLocaleString()} characters`
                    : "Help the AI prioritize what matters most to you"}
            </div>
        </div>
    );
}
