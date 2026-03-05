import { ThumbsUp, ThumbsDown, User, Bot } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
  chat_id: string;
  clerk_id: string;
  citations?: Array<{
    filename: string;
    page: number;
  }>;
}

interface MessageItemProps {
  message: Message;
  onFeedback?: (messageId: string, type: "like" | "dislike") => void;
}

export function MessageItem({ message, onFeedback }: MessageItemProps) {
  const isUser = message.role === "user";
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ── User message — boxed bubble, right-aligned ──
  if (isUser) {
    return (
      <div className="flex justify-end group">
        <div className="max-w-[75%] ml-12 relative">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl px-4 py-3 bg-white text-gray-900 border border-gray-200">
              <p className="whitespace-pre-wrap leading-relaxed text-sm">
                {message.content}
              </p>
            </div>
            <div className="flex-shrink-0 w-7 h-7 bg-[#252525] border border-gray-700 rounded-lg flex items-center justify-center mt-1">
              <User size={14} className="text-gray-400" />
            </div>
          </div>
          <div className="flex justify-end mt-1 px-10">
            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {time}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Assistant message — open, left-aligned, no box ──
  return (
    <div className="flex justify-start group">
      <div className="max-w-[85%] mr-12 relative">
        <div className="flex items-start gap-3">
          {/* Bot avatar */}
          <div className="flex-shrink-0 w-7 h-7 bg-[#252525] border border-gray-700 rounded-lg flex items-center justify-center mt-1">
            <Bot size={14} className="text-gray-400" />
          </div>

          {/* Open text — no background, no border */}
          <div className="flex-1 pt-1">
            <p className="whitespace-pre-wrap leading-relaxed text-sm text-gray-200">
              {message.content}
            </p>
          </div>
        </div>

        {/* Feedback buttons */}
        <div className="mt-3 ml-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={() => onFeedback?.(message.id, "like")}
            className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors group/btn"
            title="Like this response"
          >
            <ThumbsUp
              size={12}
              className="text-gray-400 group-hover/btn:text-gray-300 transition-colors"
            />
          </button>
          <button
            onClick={() => onFeedback?.(message.id, "dislike")}
            className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors group/btn"
            title="Dislike this response"
          >
            <ThumbsDown
              size={12}
              className="text-gray-400 group-hover/btn:text-gray-300 transition-colors"
            />
          </button>
          <span className="text-xs text-gray-500 ml-2">{time}</span>
        </div>
      </div>
    </div>
  );
}