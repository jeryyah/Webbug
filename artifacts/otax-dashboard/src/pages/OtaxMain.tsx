import { useState } from "react";
import { useLocation } from "wouter";
import {
  Bug, Zap, CheckCircle, Smartphone, Send, ChevronLeft, ChevronRight,
  Globe, Shield, Activity, Home, MessageCircle, Users, Settings
} from "lucide-react";
import MatrixBackground from "@/components/MatrixBackground";

const bugs = [
  { id: "b1", name: "DELAY AMAN UNTUK NOKOS", tag: "cspam", desc: "Kiriman beruntun delay aman" },
  { id: "b2", name: "FC iOS INVISIBLE", tag: "ios_invis", desc: "Force close invisible iOS" },
  { id: "b3", name: "SPAM NOTIF V3", tag: "notif_v3", desc: "Spam notifikasi masif" },
  { id: "b4", name: "GHOST MESSAGE", tag: "ghost_msg", desc: "Pesan tak terlihat" },
  { id: "b5", name: "CRASH ANDROID", tag: "crash_a", desc: "Force crash Android" },
  { id: "b6", name: "LOOP RING", tag: "loop_r", desc: "Panggilan loop tak henti" },
  { id: "b7", name: "BATTERY DRAIN", tag: "bat_d", desc: "Kuras baterai target" },
  { id: "b8", name: "MEDIA FLOOD", tag: "med_f", desc: "Banjiri media masif" },
  { id: "b9", name: "STATUS LOOP", tag: "stat_l", desc: "Loop status WA" },
  { id: "b10", name: "VC SILENT", tag: "vc_s", desc: "Panggilan diam total" },
];

const BUGS_PER_PAGE = 2;

export default function OtaxMain() {
  const [, setLocation] = useLocation();
  const [targetNumber, setTargetNumber] = useState("");
  const [selectedBug, setSelectedBug] = useState("b1");
  const [page, setPage] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const totalPages = Math.ceil(bugs.length / BUGS_PER_PAGE);
  const visibleBugs = bugs.slice(page * BUGS_PER_PAGE, page * BUGS_PER_PAGE + BUGS_PER_PAGE);

  const handleSend = () => {
    if (!targetNumber || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 2800);
    }, 2200);
  };

  return (
    <div className="relative flex flex-col" style={{
      maxWidth: 480, margin: "0 auto", background: "transparent",
      minHeight: "100dvh",
    }}>
      <MatrixBackground />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col">

        {/* Header */}
        <div className="header-bar">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ background: "rgba(0,240,200,0.08)", border: "1px solid rgba(0,240,200,0.2)" }}>
              <Shield size={18} style={{ color: "#00f0c8", filter: "drop-shadow(0 0 4px rgba(0,240,200,0.8))" }} />
            </div>
            <div>
              <div className="orbitron font-bold text-sm tracking-wide" style={{ color: "#e0f8f4", letterSpacing: "0.06em" }}>
                OTAX BUG
              </div>
              <div className="orbitron text-xs" style={{ color: "#00f0c8", letterSpacing: "0.04em", fontSize: 10 }}>
                WHATSAPP<span className="neon-red"> ●</span>
              </div>
            </div>
          </div>
          <div className="badge-version">v2.0</div>
        </div>

        <div style={{ padding: "8px 16px 0", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ─── Profile Card ─── */}
          <div className="glass-card rounded-2xl p-5 scan-container" data-testid="card-profile">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="avatar-ring">
                  <span className="orbitron font-black text-sm" style={{ letterSpacing: "0.04em" }}>
                    <span style={{ color: "#e0f8f4" }}>OT</span>
                    <span className="neon-red">AX</span>
                  </span>
                  <div style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 14, height: 14, borderRadius: "50%",
                    background: "#00ff9d", border: "2px solid #060913",
                    boxShadow: "0 0 10px rgba(0,255,157,0.8)",
                  }} className="pulse-dot" />
                </div>
                <div>
                  <div className="orbitron font-bold text-lg text-glow" data-testid="text-username">manxx</div>
                  <div className="badge-owner mt-1.5" data-testid="badge-owner">
                    <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff2d55", display: "inline-block" }} />
                    OWNER
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,240,200,0.10)" }}>
                <Smartphone size={12} style={{ color: "#4a6a7a" }} />
                <span className="mono text-xs" style={{ color: "#4a6a7a", fontSize: 11 }}>+029405-03-30</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="stat-card" data-testid="stat-bugs">
                <div className="icon-circle icon-circle-cyan">
                  <Bug size={18} style={{ color: "#00f0c8", filter: "drop-shadow(0 0 6px rgba(0,240,200,0.8))" }} />
                </div>
                <div className="orbitron font-black text-2xl neon-cyan">11</div>
                <div className="rajdhani font-semibold text-xs mt-1" style={{ color: "#4a6a7a", letterSpacing: "0.06em" }}>
                  TOTAL BUGS
                </div>
              </div>
              <div className="stat-card" data-testid="stat-rate">
                <div className="icon-circle icon-circle-green">
                  <Zap size={18} style={{ color: "#00ff9d", filter: "drop-shadow(0 0 6px rgba(0,255,157,0.8))" }} />
                </div>
                <div className="orbitron font-black text-lg neon-green" style={{ fontSize: 14, lineHeight: "32px" }}>GACOR</div>
                <div className="rajdhani font-semibold text-xs mt-1" style={{ color: "#4a6a7a", letterSpacing: "0.06em" }}>
                  SUCCESS
                </div>
              </div>
              <div className="stat-card" data-testid="stat-status">
                <div className="icon-circle icon-circle-green">
                  <CheckCircle size={18} style={{ color: "#00ff9d", filter: "drop-shadow(0 0 6px rgba(0,255,157,0.8))" }} />
                </div>
                <div className="orbitron font-black text-lg neon-green" style={{ fontSize: 14, lineHeight: "32px" }}>ACTIVE</div>
                <div className="rajdhani font-semibold text-xs mt-1" style={{ color: "#4a6a7a", letterSpacing: "0.06em" }}>
                  STATUS
                </div>
              </div>
            </div>
          </div>

          {/* ─── Target Number ─── */}
          <div className="glass-card rounded-2xl p-5" data-testid="card-target">
            <div className="section-label">
              <div className="section-label-bar" />
              <div className="flex items-center gap-2">
                <Smartphone size={14} style={{ color: "#00f0c8" }} />
                <span className="orbitron font-bold text-sm tracking-wide" style={{ color: "#e0f8f4" }}>
                  NOMOR TARGET
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Globe size={16} style={{ color: "#3a5a6a" }} />
              </div>
              <input
                className="cyber-input"
                placeholder="62xxxxxxxxxx"
                value={targetNumber}
                onChange={e => setTargetNumber(e.target.value)}
                data-testid="input-target-number"
                type="tel"
              />
              {targetNumber && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="badge-active">VALID</div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Bug Selection ─── */}
          <div className="glass-card rounded-2xl p-5" data-testid="card-bug-select">
            <div className="section-label">
              <div className="section-label-bar section-label-bar-red" />
              <div className="flex items-center gap-2">
                <Bug size={14} style={{ color: "#ff2d55" }} />
                <span className="orbitron font-bold text-sm tracking-wide" style={{ color: "#e0f8f4" }}>
                  PILIH BUG
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {visibleBugs.map(bug => {
                const isSelected = selectedBug === bug.id;
                return (
                  <div
                    key={bug.id}
                    className={`bug-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedBug(bug.id)}
                    data-testid={`bug-card-${bug.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isSelected ? "rgba(0,240,200,0.12)" : "rgba(30,50,80,0.5)",
                        border: `1px solid ${isSelected ? "rgba(0,240,200,0.3)" : "rgba(30,50,80,0.8)"}`,
                        transition: "all 0.3s",
                      }}>
                        <Shield size={16} style={{
                          color: isSelected ? "#00f0c8" : "#3a5a7a",
                          filter: isSelected ? "drop-shadow(0 0 4px rgba(0,240,200,0.6))" : "none",
                          transition: "all 0.3s",
                        }} />
                      </div>
                      {isSelected && (
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%",
                          background: "linear-gradient(135deg, #00f0c8, #00c8a8)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 0 12px rgba(0,240,200,0.6)",
                        }}>
                          <CheckCircle size={13} style={{ color: "#060913" }} />
                        </div>
                      )}
                    </div>
                    <div className="orbitron font-bold text-xs leading-snug mb-2" style={{
                      color: isSelected ? "#e0f8f4" : "#5a7a9a",
                      fontSize: 11, letterSpacing: "0.04em", transition: "color 0.3s",
                    }}>
                      {bug.name}
                    </div>
                    <div className="mono text-xs px-2 py-0.5 rounded-md inline-block" style={{
                      background: "rgba(0,0,0,0.4)",
                      border: `1px solid ${isSelected ? "rgba(0,240,200,0.2)" : "rgba(30,50,80,0.6)"}`,
                      color: isSelected ? "#00f0c8" : "#3a5a6a",
                      fontSize: 10, transition: "all 0.3s",
                    }}>
                      {bug.tag}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center justify-center rounded-xl transition-all"
                style={{
                  width: 34, height: 34,
                  background: page === 0 ? "rgba(20,30,50,0.4)" : "rgba(0,240,200,0.08)",
                  border: `1px solid ${page === 0 ? "rgba(30,50,80,0.4)" : "rgba(0,240,200,0.2)"}`,
                  color: page === 0 ? "#1a2a3a" : "#00f0c8",
                  cursor: page === 0 ? "not-allowed" : "pointer",
                }}
                data-testid="button-prev-bug"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="carousel-dots">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <div key={i} className={`carousel-dot ${i === page ? "active" : ""}`} />
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="flex items-center justify-center rounded-xl transition-all"
                style={{
                  width: 34, height: 34,
                  background: page === totalPages - 1 ? "rgba(20,30,50,0.4)" : "rgba(0,240,200,0.08)",
                  border: `1px solid ${page === totalPages - 1 ? "rgba(30,50,80,0.4)" : "rgba(0,240,200,0.2)"}`,
                  color: page === totalPages - 1 ? "#1a2a3a" : "#00f0c8",
                  cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                }}
                data-testid="button-next-bug"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Send Button ─── */}
        <div className="px-4 pt-2 pb-2">
          <button
            className="send-btn"
            style={sent ? {
              background: "linear-gradient(90deg, #00d48a, #00ff9d)",
              boxShadow: "0 4px 24px rgba(0,255,157,0.4)",
            } : sending ? {
              background: "linear-gradient(90deg, #007a60, #009a78)",
              boxShadow: "0 4px 16px rgba(0,150,120,0.3)",
            } : {}}
            onClick={handleSend}
            disabled={!targetNumber || sending}
            data-testid="button-send-bug"
          >
            {sent ? (
              <><CheckCircle size={20} /> BERHASIL TERKIRIM!</>
            ) : sending ? (
              <><Activity size={20} className="animate-pulse" /> SEDANG MENGIRIM...</>
            ) : (
              <><Send size={20} /> KIRIM BUG</>
            )}
          </button>
        </div>

        {/* ─── Bottom Nav ─── */}
        <div className="bottom-nav">
          <button className="nav-btn active" onClick={() => setLocation("/")} data-testid="nav-home">
            <Home size={20} style={{ color: "#00f0c8", filter: "drop-shadow(0 0 4px rgba(0,240,200,0.6))" }} />
            <span className="mono" style={{ fontSize: 9, color: "#00f0c8" }}>HOME</span>
          </button>
          <button className="nav-btn" onClick={() => setLocation("/")} data-testid="nav-wa">
            <MessageCircle size={20} style={{ color: "#3a5a6a" }} />
            <span className="mono" style={{ fontSize: 9, color: "#3a5a6a" }}>WA</span>
          </button>
          <button className="nav-btn" onClick={() => setLocation("/tools")} data-testid="nav-social">
            <Users size={20} style={{ color: "#3a5a6a" }} />
            <span className="mono" style={{ fontSize: 9, color: "#3a5a6a" }}>SOCIAL</span>
          </button>
          <button className="nav-btn-red" onClick={() => setLocation("/tools")} data-testid="nav-settings">
            <Settings size={18} style={{ color: "#fff" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
