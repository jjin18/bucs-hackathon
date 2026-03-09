"use client";

import { useState, useRef, useEffect } from "react";

type Source = { label: string; url: string };
type Message = { role: "user" | "assistant"; content: string; sources?: Source[] };

const SUGGESTED_TOP = [
  { label: "Work experience", q: "Walk me through Jia's work experience — NimbleRx, VSP, BlackBerry, key outcomes, and what she learned." },
  { label: "AI Research", q: "Tell me about Jia's AI research: health AI trust (836 reviews, trust benchmark, live eval tool, Mira 1M patients) and AI infrastructure supply chain work with Harish Krishnan (transformers, HVAC, batteries, dependency map)." },
  { label: "Hackathons", q: "Tell me about Jia's hackathon journey — Cal Hacks 1st place, MLH Top 50, what she built (e.g. Duet), and how hackathons led to her role at NimbleRx." },
  { label: "Why PM?", q: "Why did Jia choose product management over pure engineering? What draws her to PM and how does her background fit?" },
];

const SUGGESTED_BOTTOM = [
  { label: "Fav food", q: "What's Jia's favourite food? Fat Fridays, Vancouver tier list, and what she loves to eat." },
  { label: "Virality", q: "Tell me about viral moments and reach Jia has had — LinkedIn, the performative male contest, and policy virality." },
  { label: "Leadership", q: "Tell me about Jia's leadership experience — the policy campaign at 17, 15k signatures, and national media." },
  { label: "Online Persona", q: "Tell me about Jia's online persona and how she shows up on LinkedIn and in public." },
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
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif",
        fontSize: 17,
        lineHeight: 1.47,
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes jdot { 0%,80%,100%{opacity:.25;transform:translateY(0)} 40%{opacity:1;transform:translateY(-3px)} }
        @keyframes fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c7c7cc; border-radius: 3px; }
        .chip:hover { background: #D1D1D6 !important; }
        .send:hover:not(:disabled) { opacity: 0.85; }
        .msg-in { animation: fadein .2s ease both; }
        a { color: #1E90FF; text-decoration: none; }
        a:hover { text-decoration: underline; }
        textarea::placeholder { color: #8e8e93; }
        textarea { caret-color: #6699FF; }
      `}</style>

      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #c6c6c8",
          padding: "0 1rem",
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "#f6f6f6",
        }}
      >
        <button
          type="button"
          onClick={resetChat}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "none",
            border: "none",
            padding: "0.5rem 0",
            cursor: "pointer",
            color: "#1E90FF",
            fontSize: 17,
            fontWeight: 400,
          }}
          title={empty ? undefined : "Back to main chat"}
        >
          {!empty && (
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#1E90FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M16 6L8 12L16 18" />
            </svg>
          )}
          <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif", fontWeight: 600, color: "#000" }}>Jiahui Jin</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <a
            href="https://linkedin.com/in/jiahui-jin"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#1E90FF", fontSize: 17, textDecoration: "none" }}
          >
            LinkedIn
          </a>
          <a
            href="https://1drv.ms/b/c/a323242b192694d0/IQBqZcm36eaZTpT1JKpUqyYsAQUqOj9tuI5gbNisfruhUIg?e=cvPJJu"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#1E90FF", fontSize: 17, textDecoration: "none" }}
          >
            Resume
          </a>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", background: "#fff" }}>
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <img src="/avatar-waving.png" alt="Jia" style={{ width: 72, height: "auto", display: "block", flexShrink: 0 }} />
              <h1
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#000",
                  maxWidth: 520,
                  margin: 0,
                }}
              >
                Ask me anything
                <br />
                <em style={{ fontStyle: "italic", fontWeight: 400 }}>about Jia.</em>
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                gap: "2rem",
                marginBottom: "2rem",
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
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#8e8e93", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", maxWidth: 540 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
                {SUGGESTED_TOP.map(({ label, q }) => (
                  <button
                    key={label}
                    className="chip"
                    onClick={() => send(q)}
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif",
                      fontSize: 14,
                      padding: "0.45rem 0.9rem",
                      background: "#EBEBF0",
                      border: "none",
                      borderRadius: 16,
                      color: "#000",
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
                {SUGGESTED_BOTTOM.map(({ label, q }) => (
                  <button
                    key={label}
                    className="chip"
                    onClick={() => send(q)}
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif",
                      fontSize: 14,
                      padding: "0.45rem 0.9rem",
                      background: "#EBEBF0",
                      border: "none",
                      borderRadius: 16,
                      color: "#000",
                      cursor: "pointer",
                      transition: "all .2s",
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
              padding: "1rem 1rem 0.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
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
                    alignItems: "flex-end",
                    gap: "0.5rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  {!isUser && (
                    <img src="/avatar-thinking.png" alt="" style={{ width: 32, height: 32, flexShrink: 0, objectFit: "cover" }} />
                  )}
                  <div
                    style={{
                      maxWidth: "82%",
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        background: isUser ? "#1E90FF" : "#EBEBF0",
                        color: isUser ? "#fff" : "#000",
                        padding: "0.55rem 0.95rem",
                        borderRadius: 20,
                        borderBottomRightRadius: isUser ? 5 : 20,
                        borderBottomLeftRadius: isUser ? 20 : 5,
                        fontSize: "1rem",
                        lineHeight: 1.38,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                      }}
                    >
                      {m.content}
                    </div>
                    {isUser && (
                      <span style={{ fontSize: 11, color: "#8e8e93", marginTop: 2, marginRight: 2 }}>Delivered</span>
                    )}
                    {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                      <div style={{ marginTop: "0.6rem", width: "100%" }}>
                        <p style={{ fontSize: 11, color: "#8e8e93", marginBottom: "0.35rem" }}>Sources & links</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                          {m.sources.map(({ label, url }) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-block",
                                fontSize: 13,
                                padding: "0.35rem 0.65rem",
                                borderRadius: 14,
                                background: "#EBEBF0",
                                color: "#1E90FF",
                                textDecoration: "none",
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
              <div className="msg-in" style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                <img src="/avatar-thinking.png" alt="" style={{ width: 32, height: 32, flexShrink: 0, objectFit: "cover" }} />
                <div style={{ background: "#EBEBF0", padding: "0.6rem 0.95rem", borderRadius: 20, borderBottomLeftRadius: 5, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
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
          borderTop: "1px solid #c6c6c8",
          padding: "0.6rem 1rem 1rem",
          background: "#f2f2f7",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#fff",
            border: "1px solid #cccccc",
            borderRadius: 22,
            padding: "0.35rem 0.5rem 0.35rem 0.6rem",
            minHeight: 44,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
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
            placeholder="Message"
            rows={1}
            disabled={loading}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif",
              fontSize: 17,
              color: "#000",
              resize: "none",
              lineHeight: 1.4,
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
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: input.trim() && !loading ? "#007AFF" : "#c7c7cc",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background .2s",
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? "#fff" : "#8e8e93"} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M7 11l5-5 5 5" />
            </svg>
          </button>
        </div>
        <p style={{ textAlign: "center", marginTop: "0.4rem", fontSize: 11, color: "#8e8e93" }}>
          Jia&apos;s knowledge base · Built with RAG
        </p>
      </div>
    </div>
  );
}
