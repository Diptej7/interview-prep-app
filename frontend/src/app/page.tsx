"use client";

import Link from "next/link";
import {
  FileText,
  ClipboardList,
  BookOpen,
  ArrowRight,
  Shield,
  Zap,
  Brain,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Update Resume",
    description:
      "Upload your resume and a job description. Our AI agent analyzes both and generates an optimized resume in LaTeX — tailored to the role.",
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  },
  {
    icon: ClipboardList,
    title: "Prep Plan",
    description:
      "Get a structured, step-by-step preparation plan with topics, subtopics, and progress tracking — personalized to the exact job description.",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)",
  },
  {
    icon: BookOpen,
    title: "Deep Dive",
    description:
      "Click any topic in your plan for an AI-generated deep dive — theory, standard examples, and custom examples drawn from YOUR resume.",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
  },
];

const highlights = [
  {
    icon: Shield,
    text: "Privacy First",
    detail: "Resume processed in-memory only. Nothing stored.",
  },
  {
    icon: Zap,
    text: "Powered by Gemini",
    detail: "Google's most capable AI model.",
  },
  {
    icon: Brain,
    text: "Agentic AI",
    detail: "Multi-agent workflows for depth and accuracy.",
  },
];

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles size={28} color="var(--color-primary-light)" />
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
            className="gradient-text"
          >
            JobPrep AI
          </span>
        </div>
        <Link href="/dashboard" className="btn-secondary" id="nav-get-started-btn">
          Get Started <ArrowRight size={16} />
        </Link>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: "900px",
          textAlign: "center",
          padding: "5rem 2rem 3rem",
          opacity: 0,
        }}
        className="animate-slide-up"
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-glass)",
            marginBottom: "2rem",
            fontSize: "0.875rem",
            color: "var(--color-text-secondary)",
          }}
        >
          <Zap size={14} color="var(--color-accent)" />
          AI-Powered Interview Preparation
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
          }}
        >
          Ace Your Next Interview with{" "}
          <span className="gradient-text animate-gradient">Agentic AI</span>
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--color-text-secondary)",
            maxWidth: "650px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}
        >
          Upload your resume, paste a job description, and let our AI agents
          build you a tailored resume, a structured prep plan, and deep-dive
          explanations — all without ever storing your data.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/dashboard" className="btn-primary" id="hero-start-btn">
            Start Preparing <ArrowRight size={18} />
          </Link>
          <button className="btn-secondary" id="hero-learn-more-btn">
            Learn More
          </button>
        </div>
      </section>

      {/* Trust Indicators */}
      <section
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "2rem",
          opacity: 0,
        }}
        className="animate-slide-up stagger-1"
      >
        {highlights.map((item) => (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg-glass)",
              border: "1px solid var(--color-border)",
            }}
          >
            <item.icon size={18} color="var(--color-primary-light)" />
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {item.text}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {item.detail}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Feature Cards */}
      <section
        style={{
          maxWidth: "1200px",
          width: "100%",
          padding: "4rem 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`glass-card animate-slide-up stagger-${index + 2}`}
            style={{
              padding: "2rem",
              opacity: 0,
              cursor: "pointer",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-md)",
                background: feature.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                boxShadow: `0 4px 20px ${feature.color}33`,
              }}
            >
              <feature.icon size={28} color="white" />
            </div>

            {/* Content */}
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
                letterSpacing: "-0.01em",
              }}
            >
              {feature.title}
            </h3>

            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
              }}
            >
              {feature.description}
            </p>

            {/* Action hint */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: feature.color,
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Try it now <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          maxWidth: "1200px",
          padding: "3rem 2rem",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--color-text-muted)",
            fontSize: "0.875rem",
          }}
        >
          <Sparkles size={16} />
          JobPrep AI
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
          }}
        >
          Privacy-first. No resume storage. Ever.
        </div>
      </footer>
    </main>
  );
}
