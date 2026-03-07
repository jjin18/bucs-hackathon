"use client";

import { useState, useRef, useEffect } from "react";

type Source = { label: string; url: string };
type Message = { role: "user" | "assistant"; content: string; sources?: Source[] };

const SUGGESTED_TOP = [
  { label: "Work experience", q: "Walk me through your work experience in detail — NimbleRx, VSP, BlackBerry, key outcomes, and what you learned." },
  { label: "AI Research", q: "Tell me about your AI research: health AI trust (836 reviews, trust benchmark, live eval tool, Mira 1M patients) and AI infrastructure supply chain work with Harish Krishnan (transformers, HVAC, batteries, dependency map)." },
  { label: "Hackathons", q: "Tell me about your hackathon journey in detail — Cal Hacks 1st place, MLH Top 50, what you built (e.g. Duet), and how hackathons led to your job at NimbleRx." },
  { label: "Why PM?", q: "Why did you choose product management over pure engineering? Tell me what draws you to PM and how your background fits." },
];

const SUGGESTED_BOTTOM = [
  { label: "Fav food", q: "What's your favourite food and restaurant scene? Tell me about Fat Fridays, your Vancouver tier list, and what you love to eat." },
  { label: "Virality", q: "What viral moments have you had? Tell me about your reach across LinkedIn (900k+ views), the performative male contest (millions of views, SF Standard, NYT, SF Gate), policy virality (15k signatures, national news), and how your public experimentation drives attention." },
  { label: "Leadership", q: "Tell me about your leadership experience: the student policy campaign at 17 (15k signatures, national media), CUS Board (3,800 students), Programs Co-Chair (200 students), and nwplus (Canada's largest hackathons)." },
  { label: "Online Persona", q: "Tell me about your online persona and LinkedIn — your posts, the 900k+ views, your framework for hackathons and getting hired, and how you show up in public." },
];

function Dots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#7d766e",
            display: "inline-block",
            animation: "jdot 1.1s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </span>
  );
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const next: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      let data: { answer?: string; sources?: Source[]; error?: boolean };
      try {
        data = await res.json();
      } catch {
        data = { answer: res.ok ? "Invalid response." : res.status === 529 ? "The service is temporarily busy. Please try again in a moment." : `Something went wrong (${res.status}). Try again.`, error: true };
      }
      const reply = data.answer ?? (res.ok ? "No response." : res.status === 529 ? "The service is temporarily busy. Please try again in a moment." : "Something went wrong. Try again.");
      setMessages((prev) => [...prev, { role: "assistant", content: reply, sources: data.sources ?? [] }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection failed. Run the dev server and open http://127.0.0.1:3006", sources: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const empty = messages.length === 0 && !loading;

  const resetChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        color: "#111",
        fontFamily: "'EB Garamond', 'Georgia', serif",
        fontSize: 18,
        lineHeight: 1.55,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes jdot { 0%,80%,100%{opacity:.25;transform:translateY(0)} 40%{opacity:1;transform:translateY(-3px)} }
        @keyframes fadein { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d6cfc4; border-radius: 2px; }
        .chip:hover { border-color: #111 !important; color: #111 !important; }
        .send:hover:not(:disabled) { background: #c03328 !important; }
        .msg-in { animation: fadein .18s ease both; }
        a { color: #1a4a7a; text-decoration: none; }
        a:hover { text-decoration: underline; }
        textarea::placeholder { color: #7d766e; }
      `}</style>

      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #d6cfc4",
          padding: "0 1.5rem",
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "#ffffff",
        }}
      >
        <button
          type="button"
          onClick={resetChat}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.9rem",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "inherit",
          }}
          title="Back to main chat"
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#13100c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#fff", letterSpacing: 0 }}>JJ</span>
          </div>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#111" }}>
              Jiahui Jin
            </span>
          </div>
        </button>
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          {[
            ["LinkedIn", "https://linkedin.com/in/jiahui-jin"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#7d766e",
                textDecoration: "none",
                transition: "color .1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7d766e")}
            >
              {label}
            </a>
          ))}
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {empty ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "3rem 1.5rem 1rem",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              <img src="/avatar-waving.png" alt="Jia" style={{ width: 72, height: "auto", display: "block", flexShrink: 0 }} />
              <h1
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  fontWeight: 400,
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  color: "#4a4540",
                  maxWidth: 520,
                  margin: 0,
                }}
              >
                Ask me anything
                <br />
                <em style={{ fontStyle: "italic" }}>about Jia.</em>
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                gap: "2rem",
                marginBottom: "2.5rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                ["1M+", "User product launch"],
                ["Cal Hacks", "1st of 2,500+"],
                ["MLH", "Top 50 globally"],
                ["6M+", "views on social media"],
              ].map(([n, l]) => (
                <div key={n} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: "#111", letterSpacing: "0.02em" }}>{n}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#7d766e", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "#a09890", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.5rem", marginTop: "-0.4rem" }}>
              Featured on the New York Times, SF Chronicle, SF Gate, Global News, CBC, CTV
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.45rem", maxWidth: 540 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", justifyContent: "center" }}>
                {SUGGESTED_TOP.map(({ label, q }) => (
                  <button
                    key={label}
                    className="chip"
                    onClick={() => send(q)}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      letterSpacing: "0.08em",
                      padding: "0.3rem 0.75rem",
                      background: "none",
                      border: "1px solid #d6cfc4",
                      color: "#7d766e",
                      cursor: "pointer",
                      transition: "all .12s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", justifyContent: "center" }}>
                {SUGGESTED_BOTTOM.map(({ label, q }) => (
                  <button
                    key={label}
                    className="chip"
                    onClick={() => send(q)}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      letterSpacing: "0.08em",
                      padding: "0.3rem 0.75rem",
                      background: "none",
                      border: "1px solid #d6cfc4",
                      color: "#7d766e",
                      cursor: "pointer",
                      transition: "all .12s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              maxWidth: 680,
              width: "100%",
              margin: "0 auto",
              padding: "2rem 1.25rem 0.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.75rem",
            }}
          >
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={i}
                  className="msg-in"
                  style={{
                    display: "flex",
                    flexDirection: isUser ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      flexShrink: 0,
                      marginTop: 2,
                      background: isUser ? "#edebe5" : "transparent",
                      border: isUser ? "1px solid #d6cfc4" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isUser ? (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: 0, color: "#7d766e" }}>R</span>
                    ) : (
                      <img src="/avatar-thinking.png" alt="" style={{ width: 48, height: "auto", display: "block" }} />
                    )}
                  </div>
                  <div style={{ maxWidth: "82%", minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.78,
                        color: isUser ? "#4a4540" : "#111",
                        fontStyle: isUser ? "italic" : "normal",
                        paddingTop: "0.05rem",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {m.content}
                    </div>
                    {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                      <div style={{ marginTop: "0.85rem", paddingTop: "0.75rem", borderTop: "1px solid #d6cfc4" }}>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7d766e", marginBottom: "0.5rem" }}>
                          Sources & links
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                          {m.sources.map(({ label, url }) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-block",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 9,
                                letterSpacing: "0.06em",
                                padding: "0.25rem 0.5rem",
                                border: "1px solid #d6cfc4",
                                background: "#edebe5",
                                color: "#111",
                                textDecoration: "none",
                                transition: "border-color .12s, background .12s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#111";
                                e.currentTarget.style.background = "#e5e0d8";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#d6cfc4";
                                e.currentTarget.style.background = "#edebe5";
                              }}
                            >
                              {label} →
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="msg-in" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <div style={{ width: 48, flexShrink: 0, marginTop: 2 }}>
                  <img src="/avatar-thinking.png" alt="" style={{ width: 48, height: "auto", display: "block" }} />
                </div>
                <div style={{ paddingTop: "0.45rem" }}>
                  <Dots />
                </div>
              </div>
            )}
            <div ref={bottomRef} style={{ height: 1 }} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          borderTop: "1px solid #d6cfc4",
          padding: "0.85rem 1.25rem 1rem",
          background: "#ffffff",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-end",
            gap: "0.6rem",
            border: "1px solid #d6cfc4",
            background: "#edebe5",
            padding: "0.6rem 0.75rem",
            transition: "border-color .12s",
          }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = "#111")}
          onBlurCapture={(e) => (e.currentTarget.style.borderColor = "#d6cfc4")}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask about experience, research, projects…"
            rows={1}
            disabled={loading}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "0.95rem",
              color: "#111",
              resize: "none",
              lineHeight: 1.55,
              maxHeight: 120,
              overflow: "auto",
            }}
          />
          <button
            className="send"
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              background: input.trim() && !loading ? "#13100c" : "#d6cfc4",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background .12s",
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke={input.trim() && !loading ? "#f8f4ee" : "#a09890"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
            </svg>
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: "0.55rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 8,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#d6cfc4",
          }}
        >
          Jia's knowledge base
        </p>
      </div>
    </div>
  );
}
