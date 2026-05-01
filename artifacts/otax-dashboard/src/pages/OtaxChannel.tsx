import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Home, Radio, Users, Settings, Bell, BellOff,
  ShieldCheck, Wifi, WifiOff, AlertTriangle, Info,
  Zap, Lock, Send, X, ChevronDown, Eye
} from "lucide-react";
import MatrixBackground from "@/components/MatrixBackground";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface ChannelMessage {
  id: string;
  content: string;
  type: "text" | "alert" | "update" | "warning";
  timestamp: number;
  pinned?: boolean;
}

const DEV_PASS = "otax_dev_2025";

const typeConfig = {
  text: {
    border: "rgba(0,240,200,0.25)",
    glow: "rgba(0,240,200,0.08)",
    icon: <Info size={14} />,
    label: "INFO",
    accent: "#00f0c8",
    badge: "rgba(0,240,200,0.15)",
  },
  update: {
    border: "rgba(0,200,255,0.35)",
    glow: "rgba(0,200,255,0.10)",
    icon: <Zap size={14} />,
    label: "UPDATE",
    accent: "#00c8ff",
    badge: "rgba(0,200,255,0.18)",
  },
  alert: {
    border: "rgba(255,45,85,0.40)",
    glow: "rgba(255,45,85,0.10)",
    icon: <AlertTriangle size={14} />,
    label: "ALERT",
    accent: "#ff2d55",
    badge: "rgba(255,45,85,0.18)",
  },
  warning: {
    border: "rgba(255,180,0,0.40)",
    glow: "rgba(255,180,0,0.10)",
    icon: <AlertTriangle size={14} />,
    label: "WARNING",
    accent: "#ffb400",
    badge: "rgba(255,180,0,0.18)",
  },
};

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - ts;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHr < 24) return `${diffHr} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function OtaxChannel() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [notif, setNotif] = useState(true);
  const [devMode, setDevMode] = useState(false);
  const [devPass, setDevPass] = useState("");
  const [devContent, setDevContent] = useState("");
  const [devType, setDevType] = useState<ChannelMessage["type"]>("text");
  const [devSending, setDevSending] = useState(false);
  const [devError, setDevError] = useState("");
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);
  const [newMsgBadge, setNewMsgBadge] = useState(0);
  const [atBottom, setAtBottom] = useState(true);
  const feedRef = useRef<HTMLDivElement>(null);
  const sseRef = useRef<EventSource | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: smooth ? "smooth" : "auto" });
      setNewMsgBadge(0);
    }
  }, []);

  useEffect(() => {
    fetch(`${BASE}/api/channel/messages`)
      .then(r => r.json())
      .then(data => {
        setMessages(data.messages ?? []);
        setTimeout(() => scrollToBottom(false), 100);
      })
      .catch(() => {});

    const sse = new EventSource(`${BASE}/api/channel/stream`);
    sseRef.current = sse;
    sse.onopen = () => setConnected(true);
    sse.onerror = () => setConnected(false);
    sse.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "connected") { setConnected(true); return; }
        if (data.id) {
          setMessages(prev => [...prev, data as ChannelMessage]);
          if (atBottom) { setTimeout(() => scrollToBottom(true), 80); }
          else { setNewMsgBadge(n => n + 1); }
        }
      } catch {}
    };
    return () => { sse.close(); };
  }, []);

  const handleScroll = useCallback(() => {
    if (!feedRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
    const isBottom = scrollHeight - scrollTop - clientHeight < 60;
    setAtBottom(isBottom);
    if (isBottom) setNewMsgBadge(0);
  }, []);

  const handleLogoTap = () => {
    setLogoTaps(n => {
      const next = n + 1;
      if (tapTimer.current) clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => setLogoTaps(0), 2000);
      if (next >= 5) { setShowDevPanel(true); setLogoTaps(0); }
      return next;
    });
  };

  const handleDevPost = async () => {
    if (!devContent.trim()) return;
    setDevSending(true);
    setDevError("");
    try {
      const res = await fetch(`${BASE}/api/channel/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: devPass || DEV_PASS, content: devContent, type: devType }),
      });
      const data = await res.json();
      if (!res.ok) { setDevError(data.error ?? "Gagal kirim"); }
      else { setDevContent(""); setDevMode(true); }
    } catch { setDevError("Koneksi gagal"); }
    finally { setDevSending(false); }
  };

  const pinnedMsg = messages.find(m => m.pinned);
  const regularMsgs = messages.filter(m => !m.pinned);

  return (
    <div className="relative flex flex-col" style={{ maxWidth: 480, margin: "0 auto", minHeight: "100dvh", background: "#060913" }}>
      <MatrixBackground />

      <div className="relative z-10 flex flex-col" style={{ minHeight: "100dvh" }}>

        {/* ─── Header ─── */}
        <div style={{
          background: "linear-gradient(180deg, rgba(0,10,25,0.98) 0%, rgba(6,9,19,0.95) 100%)",
          borderBottom: "1px solid rgba(0,240,200,0.15)",
          padding: "12px 16px 10px",
          position: "sticky", top: 0, zIndex: 30,
          backdropFilter: "blur(20px)",
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Channel Logo — tap 5x to open dev panel */}
              <button onClick={handleLogoTap} style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "linear-gradient(135deg, #00f0c8 0%, #0066ff 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 20px rgba(0,240,200,0.4), 0 0 40px rgba(0,240,200,0.15)",
                  border: "2px solid rgba(0,240,200,0.5)",
                }}>
                  <Radio size={22} color="#fff" />
                </div>
                <span style={{
                  position: "absolute", bottom: -2, right: -2,
                  width: 14, height: 14, borderRadius: "50%",
                  background: connected ? "#00ff88" : "#ff2d55",
                  border: "2px solid #060913",
                  boxShadow: connected ? "0 0 8px rgba(0,255,136,0.8)" : "0 0 8px rgba(255,45,85,0.8)",
                }} />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="orbitron font-bold" style={{ fontSize: 14, color: "#00f0c8", letterSpacing: "0.08em" }}>OTAX CHANNEL</span>
                  <div style={{
                    background: "rgba(0,240,200,0.15)",
                    border: "1px solid rgba(0,240,200,0.3)",
                    borderRadius: 4, padding: "1px 5px",
                  }}>
                    <span className="mono" style={{ fontSize: 9, color: "#00f0c8" }}>OFFICIAL</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1">
                    {connected
                      ? <Wifi size={10} color="#00ff88" />
                      : <WifiOff size={10} color="#ff2d55" />}
                    <span className="mono" style={{ fontSize: 9, color: connected ? "#00ff88" : "#ff2d55" }}>
                      {connected ? "LIVE" : "OFFLINE"}
                    </span>
                  </div>
                  <span style={{ color: "#3a5a6a", fontSize: 9 }}>•</span>
                  <div className="flex items-center gap-1">
                    <Eye size={10} color="#3a8a7a" />
                    <span className="mono" style={{ fontSize: 9, color: "#3a8a7a" }}>1.2K subscriber</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setNotif(n => !n)} style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(0,240,200,0.08)",
                border: "1px solid rgba(0,240,200,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {notif
                  ? <Bell size={15} color="#00f0c8" />
                  : <BellOff size={15} color="#3a5a6a" />}
              </button>
            </div>
          </div>

          {/* Pinned message */}
          {pinnedMsg && (() => {
            const cfg = typeConfig[pinnedMsg.type];
            return (
              <div style={{
                marginTop: 10, borderRadius: 10,
                background: "rgba(0,240,200,0.05)",
                border: `1px solid ${cfg.border}`,
                padding: "7px 10px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{ color: cfg.accent, flexShrink: 0 }}>📌</div>
                <p className="rajdhani" style={{ fontSize: 11, color: "#a0c8c0", lineHeight: 1.4, margin: 0 }}>
                  {pinnedMsg.content}
                </p>
              </div>
            );
          })()}
        </div>

        {/* ─── Developer badge bar ─── */}
        <div style={{
          background: "rgba(0,240,200,0.04)",
          borderBottom: "1px solid rgba(0,240,200,0.08)",
          padding: "6px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} color="#00f0c8" />
            <span className="mono" style={{ fontSize: 9, color: "#3a8a7a" }}>HANYA DEVELOPER YANG BISA MENGIRIM PESAN</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock size={10} color="#3a5a6a" />
            <span className="mono" style={{ fontSize: 9, color: "#3a5a6a" }}>READ-ONLY</span>
          </div>
        </div>

        {/* ─── Message Feed ─── */}
        <div
          ref={feedRef}
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}
        >
          {messages.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <Radio size={40} color="#1a3a4a" style={{ margin: "0 auto 12px" }} />
              <p className="rajdhani" style={{ color: "#3a5a6a", fontSize: 13 }}>Belum ada pesan dari Developer.</p>
            </div>
          )}

          {regularMsgs.map((msg, i) => {
            const cfg = typeConfig[msg.type];
            const isNew = i === regularMsgs.length - 1;
            return (
              <div
                key={msg.id}
                style={{
                  borderRadius: 14,
                  background: `linear-gradient(135deg, rgba(6,15,30,0.95) 0%, ${cfg.glow} 100%)`,
                  border: `1px solid ${cfg.border}`,
                  padding: "12px 14px",
                  boxShadow: isNew ? `0 0 20px ${cfg.glow}, 0 4px 20px rgba(0,0,0,0.4)` : "0 4px 16px rgba(0,0,0,0.3)",
                  position: "relative",
                  overflow: "hidden",
                  animation: isNew ? "msgPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" : undefined,
                }}
              >
                {/* Top glow line */}
                <div style={{
                  position: "absolute", top: 0, left: 16, right: 16, height: 1,
                  background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)`,
                  opacity: 0.5,
                }} />

                <div className="flex items-start gap-3">
                  {/* Type badge */}
                  <div style={{
                    flexShrink: 0,
                    width: 30, height: 30, borderRadius: 8,
                    background: cfg.badge,
                    border: `1px solid ${cfg.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: cfg.accent,
                    boxShadow: `0 0 10px ${cfg.glow}`,
                  }}>
                    {cfg.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="mono" style={{ fontSize: 10, color: cfg.accent, fontWeight: 700, letterSpacing: "0.06em" }}>
                          {cfg.label}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck size={10} color="#00f0c8" style={{ opacity: 0.7 }} />
                          <span className="mono" style={{ fontSize: 9, color: "#3a8a7a" }}>Developer</span>
                        </span>
                      </div>
                      <span className="mono" style={{ fontSize: 9, color: "#3a5a6a" }}>{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="rajdhani" style={{
                      fontSize: 13, color: "#c8e8e0", lineHeight: 1.55,
                      margin: 0, whiteSpace: "pre-wrap",
                    }}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Scroll to bottom badge ─── */}
        {newMsgBadge > 0 && (
          <button
            onClick={() => scrollToBottom(true)}
            style={{
              position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
              background: "linear-gradient(90deg, #00f0c8, #0066ff)",
              border: "none", borderRadius: 20, padding: "6px 14px",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 4px 20px rgba(0,240,200,0.4)",
              cursor: "pointer", zIndex: 50,
            }}
          >
            <ChevronDown size={14} color="#fff" />
            <span className="mono" style={{ fontSize: 10, color: "#fff" }}>{newMsgBadge} pesan baru</span>
          </button>
        )}

        {/* ─── Dev Panel (hidden, tap logo 5x) ─── */}
        {showDevPanel && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "flex-end",
          }}>
            <div style={{
              width: "100%", maxWidth: 480, margin: "0 auto",
              background: "linear-gradient(180deg, #0a1628 0%, #060913 100%)",
              border: "1px solid rgba(0,240,200,0.25)",
              borderTopLeftRadius: 24, borderTopRightRadius: 24,
              padding: 20, boxShadow: "0 -8px 40px rgba(0,240,200,0.12)",
            }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} color="#00f0c8" />
                  <span className="orbitron font-bold" style={{ fontSize: 13, color: "#00f0c8" }}>DEV PANEL</span>
                </div>
                <button onClick={() => setShowDevPanel(false)}>
                  <X size={20} color="#3a5a6a" />
                </button>
              </div>

              {!devMode ? (
                <div>
                  <p className="rajdhani" style={{ fontSize: 12, color: "#3a8a7a", marginBottom: 8 }}>Masukkan password Developer:</p>
                  <input
                    type="password"
                    value={devPass}
                    onChange={e => setDevPass(e.target.value)}
                    placeholder="••••••••••"
                    className="channel-input"
                    style={{ marginBottom: 8 }}
                  />
                  <button
                    onClick={() => { if (devPass === DEV_PASS || devPass === "") setDevMode(true); else setDevError("Password salah"); }}
                    className="send-btn"
                    style={{ marginTop: 4, fontSize: 12, padding: "10px 0" }}
                  >
                    <Lock size={14} /> MASUK
                  </button>
                  {devError && <p className="mono" style={{ fontSize: 10, color: "#ff2d55", marginTop: 6 }}>{devError}</p>}
                </div>
              ) : (
                <div>
                  <div className="flex gap-2 mb-3" style={{ flexWrap: "wrap" }}>
                    {(["text", "update", "alert", "warning"] as const).map(t => {
                      const cfg = typeConfig[t];
                      return (
                        <button
                          key={t}
                          onClick={() => setDevType(t)}
                          style={{
                            padding: "4px 10px", borderRadius: 8,
                            background: devType === t ? cfg.badge : "rgba(255,255,255,0.04)",
                            border: `1px solid ${devType === t ? cfg.border : "rgba(255,255,255,0.08)"}`,
                            color: devType === t ? cfg.accent : "#3a5a6a",
                            fontSize: 10, cursor: "pointer",
                          }}
                          className="mono"
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    value={devContent}
                    onChange={e => setDevContent(e.target.value)}
                    placeholder="Tulis pesan informasi untuk semua user..."
                    rows={4}
                    className="channel-input"
                    style={{ resize: "none", marginBottom: 8 }}
                  />

                  {devError && <p className="mono" style={{ fontSize: 10, color: "#ff2d55", marginBottom: 6 }}>{devError}</p>}

                  <button
                    onClick={handleDevPost}
                    disabled={devSending || !devContent.trim()}
                    className="send-btn"
                    style={{ fontSize: 12, padding: "10px 0" }}
                  >
                    {devSending
                      ? <><Activity size={14} className="animate-pulse" /> MENGIRIM...</>
                      : <><Send size={14} /> KIRIM KE SEMUA USER</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Bottom Nav ─── */}
        <div className="bottom-nav">
          <button className="nav-btn" onClick={() => setLocation("/")} data-testid="nav-home">
            <Home size={20} style={{ color: "#3a5a6a" }} />
            <span className="mono" style={{ fontSize: 9, color: "#3a5a6a" }}>HOME</span>
          </button>
          <button className="nav-btn active" data-testid="nav-channel">
            <Radio size={20} style={{ color: "#00f0c8", filter: "drop-shadow(0 0 4px rgba(0,240,200,0.6))" }} />
            <span className="mono" style={{ fontSize: 9, color: "#00f0c8" }}>CHANNEL</span>
          </button>
          <button className="nav-btn" onClick={() => setLocation("/tools")} data-testid="nav-tools">
            <Users size={20} style={{ color: "#3a5a6a" }} />
            <span className="mono" style={{ fontSize: 9, color: "#3a5a6a" }}>TOOLS</span>
          </button>
          <button className="nav-btn-red" onClick={() => setLocation("/tools")} data-testid="nav-settings">
            <Settings size={18} style={{ color: "#fff" }} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes msgPop {
          0% { transform: translateY(16px) scale(0.96); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .channel-input {
          width: 100%;
          background: rgba(0,240,200,0.04);
          border: 1px solid rgba(0,240,200,0.18);
          border-radius: 10px;
          padding: 10px 12px;
          color: #c8e8e0;
          font-size: 13px;
          font-family: "Rajdhani", sans-serif;
          outline: none;
          display: block;
          box-sizing: border-box;
        }
        .channel-input:focus {
          border-color: rgba(0,240,200,0.45);
          box-shadow: 0 0 0 2px rgba(0,240,200,0.08);
        }
        .channel-input::placeholder { color: #2a4a5a; }
      `}</style>
    </div>
  );
}
