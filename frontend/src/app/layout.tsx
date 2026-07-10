import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobPrep AI — Agentic Interview Prep",
  description:
    "Privacy-focused AI-powered interview preparation. Optimize your resume, build prep plans, and deep-dive into topics — all without storing your data.",
  keywords: [
    "interview prep",
    "AI resume",
    "job preparation",
    "interview coach",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Background orbs for ambient glow effect */}
        <div
          className="bg-orb"
          style={{
            width: "600px",
            height: "600px",
            background: "var(--color-primary)",
            top: "-200px",
            right: "-100px",
          }}
        />
        <div
          className="bg-orb"
          style={{
            width: "400px",
            height: "400px",
            background: "var(--color-accent)",
            bottom: "-100px",
            left: "-100px",
          }}
        />
        <div
          className="bg-orb"
          style={{
            width: "300px",
            height: "300px",
            background: "#8b5cf6",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
