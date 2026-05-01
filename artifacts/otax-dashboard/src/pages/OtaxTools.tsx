import { useState } from "react";
import { useLocation } from "wouter";
import {
  Server, Gamepad2, Zap, Wifi, Search, Download,
  Wrench, Rocket, Sparkles, Music, Bell, LogOut,
  AlignJustify, Home, Radio, Wrench as ToolsIcon, X,
  ChevronRight, Terminal, ExternalLink, Loader2
} from "lucide-react";
import MatrixBackground from "@/components/MatrixBackground";

const tools = [
  {
    id: "panel",
    label: "Panel",
    desc: "Manajemen server",
    Icon: Server,
    color: "#ff2d55",
    endpoint: "/api/tools/panel",
    inputs: [{ key: "target", label: "Server Target", placeholder: "IP atau domain..." }],
    action: "AKSES PANEL",
  },
  {
    id: "game-ai",
    label: "Game & Ai",
    desc: "Catur, pacman, asisten",
    Icon: Gamepad2,
    color: "#ff2d55",
    endpoint: "/api/tools/game",
    inputs: [{ key: "mode", label: "Mode", placeholder: "catur / pacman / asisten..." }],
    action: "MULAI",
  },
  {
    id: "ddos",
    label: "DDoS",
    desc: "Stress test",
    Icon: Zap,
    color: "#ff2d55",
    endpoint: "/api/tools/ddos",
    inputs: [
      { key: "target", label: "Target URL", placeholder: "https://..." },
      { key: "threads", label: "Threads", placeholder: "100" },
    ],
    action: "JALANKAN",
  },
  {
    id: "network",
    label: "Network",
    desc: "WiFi, spam",
    Icon: Wifi,
    color: "#ff2d55",
    endpoint: "/api/tools/network",
    inputs: [{ key: "ssid", label: "SSID / Target", placeholder: "Nama WiFi atau nomor..." }],
    action: "SCAN",
  },
  {
    id: "osint",
    label: "OSiNT",
    desc: "NIK, domain, telepon",
    Icon: Search,
    color: "#ff2d55",
    endpoint: "/api/tools/osint",
    inputs: [{ key: "query", label: "Query", placeholder: "NIK / domain / nomor telepon..." }],
    action: "LACAK",
  },
  {
    id: "downloader",
    label: "Downloader",
    desc: "TikTok, Instagram",
    Icon: Download,
    color: "#ff2d55",
    endpoint: "/api/tools/downloader",
    inputs: [{ key: "url", label: "URL Media", placeholder: "https://tiktok.com/..." }],
    action: "DOWNLOAD",
  },
  {
    id: "utilities",
    label: "Utilities",
    desc: "QR, scanner",
    Icon: Wrench,
    color: "#ff2d55",
    endpoint: "/api/tools/utilities",
    inputs: [{ key: "data", label: "Data / URL", placeholder: "Teks atau URL untuk QR..." }],
    action: "GENERATE",
  },
  {
    id: "generator",
    label: "Generator",
    desc: "Quote, fake story",
    Icon: Rocket,
    color: "#ff2d55",
    endpoint: "/api/tools/generator",
    inputs: [{ key: "type", label: "Tipe", placeholder: "quote / fakestory / nama..." }],
    action: "GENERATE",
  },
  {
    id: "anime",
    label: "Anime",
    desc: "Streaming, 18+",
    Icon: Sparkles,
    color: "#ff2d55",
    endpoint: "/api/tools/anime",
    inputs: [{ key: "query", label: "Judul Anime", placeholder: "Cari anime..." }],
    action: "CARI",
  },
];

interface ToolDef {
  id: string;
  label: string;
  desc: string;
  Icon: React.ElementType;
  color: string;
  endpoint: string;
  inputs: { key: string; label: string; placeholder: string }[];
  action: string;
}

function ToolDrawer({ tool, onClose }: { tool: ToolDef; onClose: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(tool.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      setResult(typeof data === "string" ? data : JSON.stringify(data, null, 2));
    } catch {
      setError("Endpoint tidak tersedia atau koneksi gagal.");
    } finally {
      setLoading(false);
    }
  };

  const Icon = tool.Icon;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.82)",
      backdropFilter: "blur(10px)",
      display: "flex", alignItems: "flex-end",
    }} onClick={onClose}>
      <div
        style={{
          width: "100%", maxWidth: 480, margin: "0 auto",
          background: "linear-gradient(180deg, #10070f 0%, #0a040d 100%)",
          border: "1px solid rgba(255,45,85,0.22)",
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          padding: "20px 20px 32px",
          boxShadow: "0 -12px 60px rgba(255,45,85,0.15), 0 -4px 20px rgba(0,0,0,0.6)",
          animation: "slideUp 0.28s cubic-bezier(0.34,1.2,0.64,1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,45,85,0.25)", margin: "0 auto 18px" }} />

        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(255,45,85,0.12)",
              border: "1px solid rgba(255,45,85,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(255,45,85,0.2)",
            }}>
              <Icon size={20} color="#ff2d55" />
            </div>
            <div>
              <div className="orbitron font-bold" style={{ fontSize: 15, color: "#fff" }}>{tool.label}</div>
              <div className="rajdhani" style={{ fontSize: 11, color: "#6a3a4a" }}>{tool.desc}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} color="#6a4a5a" />
          </button>
        </div>

        {/* Endpoint info */}
        <div style={{
          background: "rgba(255,45,85,0.06)", border: "1px solid rgba(255,45,85,0.12)",
          borderRadius: 8, padding: "6px 10px", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Terminal size={11} color="#ff2d55" />
          <span className="mono" style={{ fontSize: 10, color: "#8a4a5a" }}>{tool.endpoint}</span>
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {tool.inputs.map(inp => (
            <div key={inp.key}>
              <label className="mono" style={{ fontSize: 10, color: "#8a4a5a", display: "block", marginBottom: 4 }}>
                {inp.label.toUpperCase()}
              </label>
              <input
                value={values[inp.key] ?? ""}
                onChange={e => setValues(v => ({ ...v, [inp.key]: e.target.value }))}
                placeholder={inp.placeholder}
                style={{
                  width: "100%", background: "rgba(255,45,85,0.05)",
                  border: "1px solid rgba(255,45,85,0.18)", borderRadius: 10,
                  padding: "10px 12px", color: "#e8c0c8", fontSize: 13,
                  fontFamily: "Rajdhani, sans-serif", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
        </div>

        {/* Result */}
        {result && (
          <div style={{
            background: "rgba(0,240,200,0.05)", border: "1px solid rgba(0,240,200,0.18)",
            borderRadius: 10, padding: "10px 12px", marginBottom: 12,
          }}>
            <div className="mono" style={{ fontSize: 10, color: "#00f0c8", marginBottom: 4 }}>RESPONSE</div>
            <pre className="mono" style={{ fontSize: 11, color: "#a0e8d8", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result}</pre>
          </div>
        )}
        {error && (
          <div style={{
            background: "rgba(255,45,85,0.07)", border: "1px solid rgba(255,45,85,0.25)",
            borderRadius: 10, padding: "8px 12px", marginBottom: 12,
          }}>
            <span className="mono" style={{ fontSize: 11, color: "#ff2d55" }}>{error}</span>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleRun}
          disabled={loading}
          style={{
            width: "100%", padding: "13px 0",
            background: loading
              ? "rgba(255,45,85,0.3)"
              : "linear-gradient(90deg, #c0002a 0%, #ff2d55 50%, #c0002a 100%)",
            backgroundSize: "200% 100%",
            border: "none", borderRadius: 14,
            color: "#fff", fontFamily: "Orbitron, sans-serif",
            fontWeight: 700, fontSize: 13, letterSpacing: "0.12em",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 0 24px rgba(255,45,85,0.45), 0 4px 16px rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s",
          }}
        >
          {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> MEMPROSES...</> : <>{tool.action} <ExternalLink size={14} /></>}
        </button>
      </div>
    </div>
  );
}

export default function OtaxTools() {
  const [, setLocation] = useLocation();
  const [activeNotif, setActiveNotif] = useState(true);
  const [activeTool, setActiveTool] = useState<ToolDef | null>(null);

  return (
    <div style={{ position: "relative", maxWidth: 480, margin: "0 auto", minHeight: "100dvh", background: "#05040c" }}>
      <MatrixBackground variant="red" />

      <div className="relative z-10 flex flex-col">

        {/* ─── Header ─── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px 12px",
          background: "linear-gradient(180deg, rgba(5,4,12,0.98) 0%, rgba(8,5,16,0.92) 100%)",
          borderBottom: "1px solid rgba(255,45,85,0.10)",
          position: "sticky", top: 0, zIndex: 30,
          backdropFilter: "blur(20px)",
        }}>
          <button
            onClick={() => setLocation("/")}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,45,85,0.07)",
              border: "1px solid rgba(255,45,85,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <AlignJustify size={18} color="#8a4a5a" />
          </button>

          <div style={{ textAlign: "center" }}>
            <div className="orbitron font-black" style={{ fontSize: 20, letterSpacing: "0.12em", lineHeight: 1.1 }}>
              <span style={{ color: "#fff" }}>OT</span>
              <span style={{ color: "#ff2d55", textShadow: "0 0 16px rgba(255,45,85,0.8)" }}>AX</span>
            </div>
            <div className="mono" style={{ fontSize: 8, color: "#6a3a4a", letterSpacing: "0.22em" }}>GATEWAY TOOLS</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button>
              <Music size={17} color="#4a2a3a" />
            </button>
            <button style={{ position: "relative" }} onClick={() => setActiveNotif(f => !f)}>
              <Bell size={17} color={activeNotif ? "#ff2d55" : "#4a2a3a"}
                style={activeNotif ? { filter: "drop-shadow(0 0 5px rgba(255,45,85,0.7))" } : {}} />
              {activeNotif && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  width: 13, height: 13, borderRadius: "50%",
                  background: "#ff2d55", border: "1.5px solid #05040c",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 7, color: "#fff", fontFamily: "monospace",
                }}>1</span>
              )}
            </button>
            <button onClick={() => setLocation("/")}>
              <LogOut size={17} color="#4a2a3a" />
            </button>
          </div>
        </div>

        <div style={{ padding: "12px 14px 12px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* ─── Profile Card ─── */}
          <div style={{
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(20,8,16,0.98) 0%, rgba(12,5,10,0.98) 100%)",
            border: "1px solid rgba(255,45,85,0.18)",
            padding: "16px",
            boxShadow: "0 4px 30px rgba(255,45,85,0.08), 0 8px 40px rgba(0,0,0,0.5)",
            position: "relative", overflow: "hidden",
          }}>
            {/* top glow line */}
            <div style={{
              position: "absolute", top: 0, left: 24, right: 24, height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,45,85,0.5), transparent)",
            }} />

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Logo */}
              <div style={{
                width: 58, height: 58, borderRadius: 16,
                background: "linear-gradient(135deg, rgba(255,45,85,0.18) 0%, rgba(120,0,30,0.12) 100%)",
                border: "2px solid rgba(255,45,85,0.35)",
                boxShadow: "0 0 24px rgba(255,45,85,0.2), inset 0 0 16px rgba(0,0,0,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span className="orbitron font-black" style={{ fontSize: 16 }}>
                  <span style={{ color: "#fff" }}>OT</span>
                  <span style={{ color: "#ff2d55", textShadow: "0 0 10px rgba(255,45,85,0.8)" }}>AX</span>
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div className="orbitron font-black" style={{ fontSize: 22, color: "#ff2d55", textShadow: "0 0 16px rgba(255,45,85,0.6)", lineHeight: 1 }}>OTAX</div>
                <div className="rajdhani" style={{ fontSize: 12, color: "#6a3a4a", letterSpacing: "0.06em", marginTop: 2 }}>Gateway Tools</div>
              </div>

              <div style={{
                background: "rgba(255,45,85,0.12)",
                border: "1px solid rgba(255,45,85,0.3)",
                borderRadius: 8, padding: "4px 10px",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff2d55", display: "inline-block", boxShadow: "0 0 6px #ff2d55", animation: "pulse 1.4s ease-in-out infinite" }} />
                <span className="mono" style={{ fontSize: 10, color: "#ff2d55", fontWeight: 700 }}>OWNER</span>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", marginTop: 14, paddingTop: 14,
              borderTop: "1px solid rgba(255,45,85,0.08)",
            }}>
              {[
                { label: "Active Tools", val: "9", color: "#00f0c8" },
                { label: "Requests Today", val: "247", color: "#00ff9d" },
                { label: "Uptime", val: "99.8%", color: "#00f0c8" },
              ].map((s, i) => (
                <div key={s.label} style={{
                  flex: 1, textAlign: "center",
                  borderRight: i < 2 ? "1px solid rgba(255,45,85,0.08)" : "none",
                }}>
                  <div className="orbitron font-bold" style={{ fontSize: 17, color: s.color, textShadow: `0 0 10px ${s.color}88` }}>{s.val}</div>
                  <div className="rajdhani" style={{ fontSize: 10, color: "#4a2a3a", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Tools Grid ─── */}
          <div>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 3, height: 18, borderRadius: 2, background: "#ff2d55", boxShadow: "0 0 8px rgba(255,45,85,0.6)" }} />
              <span className="orbitron font-bold" style={{ fontSize: 14, color: "#fff" }}>Tools OTAX</span>
              <div style={{
                marginLeft: "auto",
                background: "rgba(255,45,85,0.08)",
                border: "1px solid rgba(255,45,85,0.18)",
                borderRadius: 8, padding: "3px 10px",
              }}>
                <span className="mono" style={{ fontSize: 10, color: "#8a4a5a" }}>9 item</span>
              </div>
            </div>

            {/* 3×3 Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {tools.map((tool) => {
                const { id, label, desc, Icon } = tool;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTool(tool)}
                    data-testid={`tool-card-${id}`}
                    style={{
                      background: "linear-gradient(145deg, rgba(18,8,14,0.98) 0%, rgba(12,5,10,0.98) 100%)",
                      border: "1px solid rgba(255,45,85,0.16)",
                      borderRadius: 16,
                      padding: "14px 10px 12px",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 8, cursor: "pointer", textAlign: "center",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                      transition: "all 0.18s",
                      position: "relative", overflow: "hidden",
                    }}
                    onMouseDown={e => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(0.95)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,45,85,0.45)";
                    }}
                    onMouseUp={e => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,45,85,0.16)";
                    }}
                    onTouchStart={e => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(0.95)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,45,85,0.45)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(255,45,85,0.2), 0 4px 20px rgba(0,0,0,0.5)";
                    }}
                    onTouchEnd={e => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,45,85,0.16)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
                    }}
                  >
                    {/* top glow */}
                    <div style={{
                      position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(255,45,85,0.4), transparent)",
                    }} />

                    {/* Icon circle */}
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: "rgba(255,45,85,0.10)",
                      border: "1px solid rgba(255,45,85,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 0 18px rgba(255,45,85,0.14)",
                    }}>
                      <Icon size={24} color="#ff2d55" style={{ filter: "drop-shadow(0 0 6px rgba(255,45,85,0.7))" }} />
                    </div>

                    <div className="orbitron font-bold" style={{ fontSize: 11, color: "#e8d0d8", letterSpacing: "0.03em", lineHeight: 1.2 }}>
                      {label}
                    </div>
                    <div className="rajdhani" style={{ fontSize: 10, color: "#4a2a3a", lineHeight: 1.3 }}>
                      {desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ─── Bottom Nav ─── */}
        <div style={{
          background: "rgba(5,4,12,0.98)",
          borderTop: "1px solid rgba(255,45,85,0.10)",
          padding: "12px 28px env(safe-area-inset-bottom, 14px)",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          backdropFilter: "blur(20px)",
          marginTop: 8,
        }}>
          <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 12px", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setLocation("/")}>
            <Home size={20} color="#3a2a3a" />
            <span className="mono" style={{ fontSize: 9, color: "#3a2a3a" }}>HOME</span>
          </button>
          <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 12px", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setLocation("/channel")}>
            <Radio size={20} color="#3a2a3a" />
            <span className="mono" style={{ fontSize: 9, color: "#3a2a3a" }}>CHANNEL</span>
          </button>
          <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 12px", background: "none", border: "none", cursor: "pointer" }}>
            <ToolsIcon size={20} color="#00f0c8" style={{ filter: "drop-shadow(0 0 5px rgba(0,240,200,0.7))" }} />
            <span className="mono" style={{ fontSize: 9, color: "#00f0c8" }}>TOOLS</span>
          </button>
          <button style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, #c0002a 0%, #ff2d55 100%)",
            border: "none", cursor: "pointer",
            boxShadow: "0 0 20px rgba(255,45,85,0.5), 0 4px 14px rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", display: "block" }} />
          </button>
        </div>
      </div>

      {/* ─── Tool Drawer ─── */}
      {activeTool && <ToolDrawer tool={activeTool} onClose={() => setActiveTool(null)} />}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
