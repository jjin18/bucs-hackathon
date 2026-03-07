"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      let data: { answer?: string; error?: boolean };
      try {
        data = await res.json();
      } catch {
        data = { answer: res.ok ? "Invalid response." : `Server error ${res.status}. Check the terminal.` };
      }
      const reply = data.answer ?? (res.ok ? "No response." : "Something went wrong.");
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection failed. Run the dev server (npm run dev or start.bat) and open http://127.0.0.1:3005" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 24,
        maxWidth: 640,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Jiahui Jin — Portfolio</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        Ask about experience, projects, or background. Powered by Claude.
      </p>

      <div style={{ flex: 1, marginBottom: 24 }}>
        {messages.length === 0 && !loading && (
          <p style={{ color: "#999", fontSize: 14 }}>
            Type a question and press Send or Enter.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 16,
              padding: 12,
              background: m.role === "user" ? "#f0f0f0" : "#e8f4f8",
              borderRadius: 8,
            }}
          >
            <strong style={{ fontSize: 12, color: "#666" }}>
              {m.role === "user" ? "You" : "Jia's AI"}
            </strong>
            <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: "#666", fontSize: 14 }}>Thinking…</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a question..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px 12px",
            fontSize: 16,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            background: "#333",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
