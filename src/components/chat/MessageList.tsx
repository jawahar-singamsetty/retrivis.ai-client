import { useEffect, useRef, useState } from "react";
import { MessageItem } from "./MessageItem";
import { FileText, Loader2, X, Bot } from "lucide-react";
import { createPortal } from "react-dom";

interface Citation {
  chunk_id: string;
  document_id: string;
  filename: string;
  page: number;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
  chat_id: string;
  clerk_id: string;
  citations?: Citation[];
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  streamingMessage?: string;
  isStreaming?: boolean;
  agentStatus?: string;
  onFeedback?: (messageId: string, type: "like" | "dislike") => void;
}

interface ChunkPopup {
  citation: Citation;
  content: string | null;
  loading: boolean;
  error: string | null;
}

export function MessageList({
  messages = [],
  isLoading,
  streamingMessage = "",
  isStreaming = false,
  agentStatus = "",
  onFeedback,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<ChunkPopup | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Close popup on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopup(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleCitationClick = async (citation: Citation, projectId: string) => {
    // Open popup immediately with loading state
    setPopup({ citation, content: null, loading: true, error: null });

    try {
      const token = await (window as any).Clerk?.session?.getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/chunks/${citation.chunk_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch chunk content");

      const data = await res.json();
      const content = data.data?.content || data.data?.text || "No content available";

      setPopup((prev) =>
        prev ? { ...prev, content, loading: false } : null
      );
    } catch (err) {
      setPopup((prev) =>
        prev
          ? { ...prev, loading: false, error: "Could not load source text." }
          : null
      );
    }
  };

  // Extract project_id from URL
  const getProjectId = () => {
    if (typeof window === "undefined") return "";
    const parts = window.location.pathname.split("/");
    const idx = parts.indexOf("projects");
    return idx !== -1 ? parts[idx + 1] : "";
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#1a1a1a] relative">
      {/* Citation Popup via Portal — renders directly to document.body */}
      {popup && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => setPopup(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1e1e1e",
              border: "1px solid #374151",
              borderRadius: "12px",
              width: "600px",
              maxWidth: "90vw",
              maxHeight: "70vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: "1px solid #374151",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "28px", height: "28px",
                  backgroundColor: "#252525",
                  border: "1px solid #4B5563",
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FileText size={13} color="#9CA3AF" />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#E5E7EB", margin: 0 }}>
                    {popup.citation.filename}
                  </p>
                  <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
                    Page {popup.citation.page}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPopup(null)}
                style={{
                  width: "26px", height: "26px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                <X size={14} color="#9CA3AF" />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {popup.loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 0" }}>
                  <Loader2 size={18} color="#9CA3AF" className="animate-spin" />
                  <span style={{ fontSize: "14px", color: "#9CA3AF", marginLeft: "8px" }}>
                    Loading source text...
                  </span>
                </div>
              ) : popup.error ? (
                <p style={{ fontSize: "14px", color: "#F87171", textAlign: "center", padding: "32px 0" }}>
                  {popup.error}
                </p>
              ) : (
                <p style={{
                  fontSize: "14px", color: "#D1D5DB",
                  lineHeight: "1.6", whiteSpace: "pre-wrap", margin: 0,
                }}>
                  {popup.content}
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: "8px 16px",
              borderTop: "1px solid #374151",
              flexShrink: 0,
            }}>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
                Press <kbd style={{
                  padding: "1px 5px",
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #4B5563",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#9CA3AF",
                  fontFamily: "monospace",
                }}>Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

    {/* Main chat area */}
    <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
      {messages.length === 0 && !isStreaming && !isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400 max-w-md mx-auto px-6">
            <div className="w-12 h-12 bg-[#252525] border border-gray-700 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <FileText size={18} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-3">
              Start a conversation
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Ask me anything about your documents and I'll help you find the
              answers.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <MessageItem message={message} onFeedback={onFeedback} />

                {message.role === "assistant" &&
                  message.citations &&
                  message.citations.length > 0 && (
                    <div className="mt-6 ml-0">
                      <div className="bg-[#202020] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-5 h-5 bg-[#252525] border border-gray-700 rounded-md flex items-center justify-center">
                            <FileText size={12} className="text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-300">
                            Sources ({message.citations.length})
                          </span>
                        </div>

                        <div className="grid gap-2">
                          {message.citations.map((citation, citationIndex) => (
                            <button
                              key={citationIndex}
                              onClick={() =>
                                handleCitationClick(citation, getProjectId())
                              }
                              className="flex items-center gap-3 bg-[#252525] hover:bg-[#2a2a2a] rounded-lg px-3 py-2 border border-gray-700 hover:border-gray-500 transition-colors text-left w-full cursor-pointer"
                            >
                              <div className="flex-shrink-0 w-7 h-7 bg-[#2a2a2a] border border-gray-600 rounded-md flex items-center justify-center">
                                <FileText size={12} className="text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-200 truncate">
                                  {citation.filename}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Page {citation.page} · Click to view source
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 bg-[#2a2a2a] border border-gray-600 rounded-md flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-400">
                                    {citation.page}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))}

            {isStreaming && streamingMessage && (
              <div className="group">
                <div className="flex justify-start">
                  <div className="max-w-[85%] mr-12">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 bg-[#252525] border border-gray-700 rounded-lg flex items-center justify-center mt-1">
                        <Bot size={14} className="text-gray-400" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="whitespace-pre-wrap text-gray-200 leading-relaxed text-sm">
                          {streamingMessage}
                        </p>
                        <div className="flex items-center gap-1 mt-3">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isLoading && !isStreaming && (
              <div className="flex justify-start">
                <div className="bg-[#202020] border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 size={16} className="text-gray-400 animate-spin" />
                    <span className="text-sm text-gray-300">
                      {agentStatus || "Thinking..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
    </div>
  );
}