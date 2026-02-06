import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Dynamic params for use-case pages
  const title = searchParams.get("title") || "Discover AI Agent Workflows";
  const subtitle = searchParams.get("subtitle") || "The community directory for OpenClaw use cases";
  const category = searchParams.get("category");
  const complexity = searchParams.get("complexity");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fafaf9",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern - diagonal lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              rgba(217, 119, 6, 0.03) 40px,
              rgba(217, 119, 6, 0.03) 80px
            )`,
          }}
        />

        {/* Decorative claw marks in corner */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -50,
            display: "flex",
            opacity: 0.08,
          }}
        >
          <svg width="400" height="400" viewBox="0 0 100 100">
            <path
              d="M30 10 L40 90 M50 5 L60 95 M70 10 L80 90"
              stroke="#d97706"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "60px 80px",
            justifyContent: "space-between",
          }}
        >
          {/* Top: Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Claw icon */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 4L8 20M11 3L13 21M16 4L18 20"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "2px",
              }}
            >
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#1c1917",
                  letterSpacing: "-0.02em",
                }}
              >
                Claw
              </span>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#d97706",
                  letterSpacing: "-0.02em",
                }}
              >
                Dex
              </span>
            </div>
          </div>

          {/* Center: Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "900px",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? "48px" : "56px",
                fontWeight: 800,
                color: "#1c1917",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "24px",
                color: "#78716c",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>

            {/* Tags */}
            {(category || complexity) && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                {category && (
                  <div
                    style={{
                      background: "rgba(217, 119, 6, 0.1)",
                      border: "1px solid rgba(217, 119, 6, 0.2)",
                      borderRadius: "9999px",
                      padding: "8px 20px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#b45309",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {category}
                  </div>
                )}
                {complexity && (
                  <div
                    style={{
                      background:
                        complexity === "beginner"
                          ? "rgba(16, 185, 129, 0.1)"
                          : complexity === "intermediate"
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(139, 92, 246, 0.1)",
                      border: `1px solid ${
                        complexity === "beginner"
                          ? "rgba(16, 185, 129, 0.2)"
                          : complexity === "intermediate"
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(139, 92, 246, 0.2)"
                      }`,
                      borderRadius: "9999px",
                      padding: "8px 20px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color:
                        complexity === "beginner"
                          ? "#059669"
                          : complexity === "intermediate"
                          ? "#2563eb"
                          : "#7c3aed",
                      textTransform: "capitalize",
                    }}
                  >
                    {complexity}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom: Stats */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#d97706",
                }}
              >
                90+
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#a8a29e",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Use Cases
              </span>
            </div>
            <div
              style={{
                width: "1px",
                height: "24px",
                background: "#e7e5e4",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  color: "#a8a29e",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                clawdex.io
              </span>
            </div>
          </div>
        </div>

        {/* Accent bar at bottom */}
        <div
          style={{
            height: "6px",
            background: "linear-gradient(90deg, #f59e0b 0%, #d97706 50%, #ea580c 100%)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
