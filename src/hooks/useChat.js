import { useState, useCallback } from "react";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";
const CHAT_TIMEOUT_MS = Number(import.meta.env.VITE_CHAT_TIMEOUT) || 90000;

/** In dev, use Vite proxy to avoid CORS (browser → Vite → n8n). */
function getChatFetchUrl() {
  if (!N8N_WEBHOOK_URL.trim()) return "";
  if (import.meta.env.DEV) {
    try {
      const u = new URL(N8N_WEBHOOK_URL);
      return `/api/n8n${u.pathname}${u.search}`;
    } catch {
      return N8N_WEBHOOK_URL;
    }
  }
  return N8N_WEBHOOK_URL;
}

/* ---------- Session ID (persistent per user) ---------- */
function getSessionId() {
  let sessionId = localStorage.getItem("chat-session-id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("chat-session-id", sessionId);
  }

  return sessionId;
}

/* ---------- Normalize n8n response ---------- */
function parseN8nResponse(body) {
  if (!body || typeof body !== "object") {
    return {
      response: "",
      intent: null,
      responseSource: null,
      realTimeData: null,
    };
  }

  const response =
    body.response ??
    body.output ??
    body.text ??
    body.json?.response ??
    body.data?.response ??
    "";

  return {
    response:
      typeof response === "string"
        ? response
        : JSON.stringify(response ?? ""),
    intent: body.intent ?? body.json?.intent ?? null,
    responseSource: body.responseSource ?? body.json?.responseSource ?? null,
    realTimeData:
      body.realTimeData ??
      body.real_time_data ??
      body.json?.realTimeData ??
      null,
  };
}

/** Parse one line from n8n stream (NDJSON or SSE "data: {...}"). */
function parseStreamLine(line) {
  const raw = line.startsWith("data:") ? line.slice(5).trim() : line.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Read NDJSON/SSE stream from response body and call onItem(content) for each type:"item" chunk. */
async function readN8nStream(response, onItem) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (value) buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const obj = parseStreamLine(line);
      if (obj && obj.type === "item" && typeof obj.content === "string") {
        onItem(obj.content);
      }
    }
    if (done) break;
  }
  if (buffer.trim()) {
    const obj = parseStreamLine(buffer);
    if (obj && obj.type === "item" && typeof obj.content === "string") {
      onItem(obj.content);
    }
  }
}

/** Create a batched onItem callback: accumulates chunks and flushes to setMessages at most every 50ms. */
function createBatchedOnItem(assistantId, setMessages) {
  let pending = "";
  let rafId = null;

  const flush = () => {
    if (pending === "") return;
    const toAdd = pending;
    pending = "";
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last && last.type === "assistant" && last.id === assistantId) {
        next[next.length - 1] = { ...last, content: last.content + toAdd };
      }
      return next;
    });
  };

  const onItem = (chunk) => {
    pending += chunk;
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        flush();
      });
    }
  };

  return { onItem, flush };
}

/* ---------- Chat Hook ---------- */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (query) => {
      if (!query || !query.trim()) return;

      if (!N8N_WEBHOOK_URL.trim()) {
        setError("Chat is not configured. Set VITE_N8N_WEBHOOK_URL in .env");
        return;
      }

      const sessionId = getSessionId();

      const userMessage = {
        id: Date.now().toString(),
        type: "user",
        content: query,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

        const res = await fetch(getChatFetchUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "sendMessage",
            chatInput: query.trim(),
            sessionId,
            metadata: {},
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errBody = await res.text();
          let msg = "Agent unavailable. Please try again in a moment.";

          if (res.status >= 500) {
            msg = "Agent unavailable. Please try again in a moment.";
          } else if (res.status === 408 || res.status === 504) {
            msg = "The request took too long. Please try again.";
          } else {
            try {
              const j = JSON.parse(errBody);
              if (j.message) msg = j.message;
              else if (j.error)
                msg =
                  typeof j.error === "string"
                    ? j.error
                    : JSON.stringify(j.error);
            } catch {
              if (errBody && errBody.length < 300) msg = errBody;
            }
          }

          throw new Error(msg);
        }

        const contentType = (res.headers.get("Content-Type") || "").toLowerCase();
        const contentTypeSuggestsStream =
          contentType.includes("text/event-stream") ||
          contentType.includes("ndjson") ||
          contentType.includes("application/x-ndjson") ||
          contentType.includes("text/plain");

        if (!res.body) {
          const text = await res.text();
          const data = (() => { try { return JSON.parse(text); } catch { return null; } })();
          const { response: textResp, intent, responseSource, realTimeData } = parseN8nResponse(data || {});
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: textResp || text || "",
              timestamp: new Date(),
              intent,
              responseSource,
              tokenData: realTimeData,
            },
          ]);
        } else if (contentTypeSuggestsStream) {
          const assistantId = (Date.now() + 1).toString();
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              type: "assistant",
              content: "",
              timestamp: new Date(),
              intent: null,
              responseSource: null,
              tokenData: null,
            },
          ]);
          const batched = createBatchedOnItem(assistantId, setMessages);
          await readN8nStream(res, batched.onItem);
          batched.flush();
        } else {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let streamMode = null;
          let assistantId = null;
          let batched = null;

          while (true) {
            const { done, value } = await reader.read();
            if (value) buffer += decoder.decode(value, { stream: true });

            if (streamMode === null) {
              const firstNewline = buffer.indexOf("\n");
              if (firstNewline !== -1) {
                const firstLine = buffer.slice(0, firstNewline).trim();
                const obj = parseStreamLine(firstLine);
                if (obj && (obj.type === "begin" || obj.type === "item")) {
                  streamMode = "stream";
                  assistantId = (Date.now() + 1).toString();
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: assistantId,
                      type: "assistant",
                      content: "",
                      timestamp: new Date(),
                      intent: null,
                      responseSource: null,
                      tokenData: null,
                    },
                  ]);
                  batched = createBatchedOnItem(assistantId, setMessages);
                  const lines = buffer.split("\n");
                  buffer = lines.pop() ?? "";
                  for (const line of lines) {
                    const o = parseStreamLine(line);
                    if (o && o.type === "item" && typeof o.content === "string") {
                      batched.onItem(o.content);
                    }
                  }
                } else {
                  streamMode = "json";
                }
              }
            } else if (streamMode === "stream" && batched) {
              const lines = buffer.split("\n");
              buffer = lines.pop() ?? "";
              for (const line of lines) {
                const o = parseStreamLine(line);
                if (o && o.type === "item" && typeof o.content === "string") {
                  batched.onItem(o.content);
                }
              }
            }

            if (done) break;
          }

          if (streamMode === "stream" && buffer.trim()) {
            const o = parseStreamLine(buffer);
            if (o && o.type === "item" && typeof o.content === "string" && batched) {
              batched.onItem(o.content);
            }
          }
          if (streamMode === "stream" && batched) {
            batched.flush();
          } else if (streamMode !== "stream") {
            let data = null;
            try {
              data = JSON.parse(buffer);
            } catch {
              data = null;
            }
            const { response: textResp, intent, responseSource, realTimeData } = parseN8nResponse(data || {});
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                type: "assistant",
                content: textResp || "",
                timestamp: new Date(),
                intent,
                responseSource,
                tokenData: realTimeData,
              },
            ]);
          }
        }
      } catch (err) {
        const message =
          err.name === "AbortError"
            ? "The request took too long. Please try again."
            : err instanceof Error
              ? (err.message?.toLowerCase().includes("fetch") || err.message === "NetworkError when attempting to fetch resource"
                  ? "Agent unavailable. Please check your connection and try again."
                  : err.message)
              : "Something went wrong. Please try again.";

        setError(message);

        if (import.meta.env.DEV) {
          console.error("Chat error:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    setError,
  };
}