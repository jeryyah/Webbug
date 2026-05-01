import { useState } from "react";
import { useLocation } from "wouter";
import {
  Server, Gamepad2, Zap, Wifi, Search, Download,
  Wrench, Rocket, Sparkles, Music, Bell, LogOut,
  AlignJustify, Home, MessageCircle, Users, ChevronRight
} from "lucide-react";
import MatrixBackground from "@/components/MatrixBackground";

const tools = [
  { id: "panel", label: "Panel", desc: "Manajemen server", Icon: Server },
  { id: "game-ai", label: "Game & Ai", desc: "Catur, pacman, asisten", Icon: Gamepad2 },
  { id: "ddos", label: "DDoS", desc: "Stress test", Icon: Zap },
  { id: "network", label: "Network", desc: "WiFi, spam", Icon: Wifi },
  { id: "osint", label: "OSiNT", desc: "NiK, domain, telepon", Icon: Search },
  { id: "downloader", label: "Downloader", desc: "TikTok, instagram", Icon: Download },
  { id: "utilities", label: "Utilities", desc: "QR, scanner", Icon: Wrench },
  { id: "generator", label: "Generator", desc: "Quote, fake story", Icon: Rocket },
  { id: "anime", label: "Anime", desc: "Streaming, 18+", Icon: Sparkles },
];

export default function OtaxTools() {
  const [, setLocation] = useLocation();
  const [activeNotif, setActiveNotif] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen flex flex-col" style={{ maxWidth: 480, margin: "0 auto" }}>
      <MatrixBackground />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Header */}
        <div className="header-bar">
          <button
            className="flex items-center justify-center rounded-xl transition-all"
            style={{ width: 40, height: 40, background: "rgba(0,240,200,0.06)", border: "1px solid rgba(0,240,200,0.14)" }}
            onClick={() => setLocation("/")}
            data-testid="button-menu"
          >
            <AlignJustify size={18} style={{ color: "#4a7a8a" }} />
          </button>

          <div className="flex flex-col items-center">
            <span className="orbitron font-black text-2xl tracking-widest" style={{ letterSpacing: "0.12em" }}>
              <span style={{ color: "#e0f8f4", textShadow: "0 0 20px rgba(0,240,200,0.15)" }}>OT</span>
              <span className="neon-red">AX</span>
            </span>
            <span className="mono text-xs" style={{ color: "#3a5a6a", letterSpacing: "0.2em", fontSize: 9 }}>GATEWAY TOOLS</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative" data-testid="button-music">
              <Music size={18} style={{ color: "#3a5a6a" }} />
            </button>
            <button className="relative" data-testid="button-notif" onClick={() => setActiveNotif(f => !f)}>
              <Bell size={18} style={{ color: activeNotif ? "#00f0c8" : "#3a5a6a", filter: activeNotif ? "drop-shadow(0 0 4px rgba(0,240,200,0.6))" : "none" }} />
              {activeNotif && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full pulse-dot flex items-center justify-center"
                  style={{ background: "#ff2d55", fontSize: 7, color: "#fff", fontFamily: "monospace" }}>1</span>
              )}
            </button>
            <button data-testid="button-logout" onClick={() => setLocation("/")}>
              <LogOut size={18} style={{ color: "#3a5a6a" }} />
            </button>
          </div>
        </div>

        <div className="flex-1 px-4 pb-4 overflow-y-auto pt-2 space-y-4">

          {/* ─── Profile Row ─── */}
          <div className="glass-card rounded-2xl p-4" data-testid="card-profile-tools">
            <div className="flex items-center gap-4">
              <div style={{
                width: 60, height: 60, borderRadius: 18,
                background: "linear-gradient(135deg, rgba(255,45,85,0.15) 0%, rgba(180,0,60,0.08) 100%)",
                border: "2px solid rgba(255,45,85,0.3)",
                boxShadow: "0 0 20px rgba(255,45,85,0.15), inset 0 0 20px rgba(0,0,0,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <span className="orbitron font-black text-base">
                  <span style={{ color: "#e0f8f4" }}>OT</span>
                  <span className="neon-red">AX</span>
                </span>
              </div>

              <div className="flex-1">
                <div className="orbitron font-black text-2xl text-glow" data-testid="text-brand-name">OTAX</div>
                <div className="rajdhani font-semibold" style={{ color: "#4a6a7a", fontSize: 13, letterSpacing: "0.04em" }}>
                  Gateway Tools
                </div>
              </div>

              <div className="badge-owner" data-testid="badge-owner-tools">
                <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff2d55", display: "inline-block" }} />
                OWNER
              </div>
            </div>

            {/* Mini stats row */}
            <div className="flex items-center gap-3 mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(0,240,200,0.08)" }}>
              {[
                { label: "Active Tools", val: "9", color: "#00f0c8" },
                { label: "Requests Today", val: "247", color: "#00ff9d" },
                { label: "Uptime", val: "99.8%", color: "#00f0c8" },
              ].map(s => (
                <div key={s.label} className="flex-1 text-center">
                  <div className="orbitron font-bold" style={{ color: s.color, fontSize: 16, textShadow: `0 0 8px ${s.color}66` }}>{s.val}</div>
                  <div className="rajdhani" style={{ color: "#3a5a6a", fontSize: 11, letterSpacing: "0.04em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Tools Grid ─── */}
          <div>
            <div className="section-label">
              <div className="section-label-bar" />
              <span className="rajdhani font-bold text-lg text-glow">Tools OTAX</span>
              <div className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg mono text-xs"
                style={{ background: "rgba(0,240,200,0.06)", border: "1px solid rgba(0,240,200,0.12)", color: "#4a7a8a" }}>
                {tools.length} item
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {tools.map(({ id, label, desc, Icon }) => {
                const isActive = selectedTool === id;
                return (
                  <div
                    key={id}
                    className="tool-card"
                    style={isActive ? {
                      borderColor: "rgba(255,45,85,0.5)",
                      background: "linear-gradient(145deg, rgba(255,45,85,0.12) 0%, rgba(8,8,20,0.95) 100%)",
                      boxShadow: "0 0 28px rgba(255,45,85,0.18), 0 8px 32px rgba(0,0,0,0.4)",
                    } : {}}
                    onClick={() => setSelectedTool(isActive ? null : id)}
                    data-testid={`tool-card-${id}`}
                  >
                    <div className="tool-icon-wrap" style={isActive ? {
                      background: "rgba(255,45,85,0.22)",
                      borderColor: "rgba(255,45,85,0.45)",
                      boxShadow: "0 0 24px rgba(255,45,85,0.25)",
                    } : {}}>
                      <Icon size={22} style={{
                        color: "#ff2d55",
                        filter: isActive
                          ? "drop-shadow(0 0 8px rgba(255,45,85,0.9))"
                          : "drop-shadow(0 0 4px rgba(255,45,85,0.5))",
                      }} />
                    </div>
                    <div className="rajdhani font-bold text-sm" style={{ color: "#d0e8e4", letterSpacing: "0.02em" }}>{label}</div>
                    <div className="rajdhani text-xs mt-1" style={{ color: "#3a5a6a", lineHeight: 1.3 }}>{desc}</div>
                    {isActive && (
                      <div className="mt-2 flex items-center gap-1" style={{ color: "#ff2d55", fontSize: 11 }}>
                        <span className="mono" style={{ fontSize: 10 }}>OPEN</span>
                        <ChevronRight size={11} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Bottom Nav ─── */}
        <div className="bottom-nav">
          <button className="nav-btn" onClick={() => setLocation("/")} data-testid="nav-home">
            <Home size={20} style={{ color: "#3a5a6a" }} />
            <span className="mono" style={{ fontSize: 9, color: "#3a5a6a" }}>HOME</span>
          </button>
          <button className="nav-btn" data-testid="nav-wa">
            <MessageCircle size={20} style={{ color: "#3a5a6a" }} />
            <span className="mono" style={{ fontSize: 9, color: "#3a5a6a" }}>WA</span>
          </button>
          <button className="nav-btn active" data-testid="nav-tools">
            <Users size={20} style={{ color: "#00f0c8", filter: "drop-shadow(0 0 4px rgba(0,240,200,0.6))" }} />
            <span className="mono" style={{ fontSize: 9, color: "#00f0c8" }}>TOOLS</span>
          </button>
          <button className="nav-btn-red" data-testid="nav-record">
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", display: "block" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
