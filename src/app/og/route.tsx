import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "Discover AI Agent Workflows";
  const subtitle =
    searchParams.get("subtitle") ||
    "The community directory for OpenClaw use cases";
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
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            height: "8px",
            width: "100%",
            background: "linear-gradient(90deg, #f59e0b, #d97706, #ea580c)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "48px 64px",
            justifyContent: "space-between",
          }}
        >
          {/* Logo section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: "24px",
                  fontWeight: 900,
                }}
              >
                C
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#1c1917",
                }}
              >
                Claw
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#d97706",
                }}
              >
                Dex
              </span>
            </div>
          </div>

          {/* Title section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: title.length > 50 ? "44px" : "52px",
                fontWeight: 800,
                color: "#1c1917",
                lineHeight: 1.15,
                marginBottom: "16px",
                maxWidth: "900px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "22px",
                color: "#78716c",
                lineHeight: 1.4,
                maxWidth: "800px",
              }}
            >
              {subtitle}
            </div>

            {/* Tags */}
            {(category || complexity) && (
              <div
                style={{
                  display: "flex",
                  marginTop: "24px",
                }}
              >
                {category && (
                  <div
                    style={{
                      background: "#fef3c7",
                      border: "2px solid #fcd34d",
                      borderRadius: "20px",
                      padding: "6px 16px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#b45309",
                      textTransform: "uppercase",
                      marginRight: "12px",
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
                          ? "#d1fae5"
                          : complexity === "intermediate"
                            ? "#dbeafe"
                            : "#ede9fe",
                      border: `2px solid ${
                        complexity === "beginner"
                          ? "#6ee7b7"
                          : complexity === "intermediate"
                            ? "#93c5fd"
                            : "#c4b5fd"
                      }`,
                      borderRadius: "20px",
                      padding: "6px 16px",
                      fontSize: "14px",
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

          {/* Footer with CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#d97706",
                  marginRight: "8px",
                }}
              >
                90+
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#a8a29e",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  marginRight: "32px",
                }}
              >
                Use Cases
              </span>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  background: "#d6d3d1",
                  marginRight: "32px",
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: "#a8a29e",
                  fontWeight: 500,
                }}
              >
                www.clawdex.io
              </span>
            </div>

            {/* CTA Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                borderRadius: "8px",
                padding: "12px 24px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Browse Now →
              </span>
            </div>
          </div>
        </div>

        {/* Bottom gradient bar */}
        <div
          style={{
            height: "6px",
            width: "100%",
            background: "linear-gradient(90deg, #f59e0b, #d97706, #ea580c)",
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
