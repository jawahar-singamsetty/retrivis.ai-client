import { useState } from "react";
import { Search, FileText, Loader2 } from "lucide-react";

interface ChunksViewerProps {
  chunks: any[];
  chunksLoading: boolean;
  selectedChunk: any;
  onSelectChunk: (chunk: any) => void;
}

export function ChunksViewer({
  chunks,
  chunksLoading,
  selectedChunk,
  onSelectChunk,
}: ChunksViewerProps) {
  const [chunksFilter, setChunksFilter] = useState<"all" | "text" | "image" | "table">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChunks = chunks.filter((chunk) => {
    const matchesFilter =
      chunksFilter === "all" ||
      (Array.isArray(chunk.type) && chunk.type.includes(chunksFilter));
    const matchesSearch = chunk.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: "24px", borderBottom: "1px solid #374151" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ color: "#f3f4f6", fontWeight: 500, fontSize: "18px" }}>Content Chunks</h3>
          <span style={{ color: "#9ca3af", fontSize: "14px" }}>
            {filteredChunks.length} of {chunks.length} chunks
          </span>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {["all", "text", "image", "table"].map((filter) => (
              <button
                key={filter}
                onClick={() => setChunksFilter(filter as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  chunksFilter === filter
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-[#2a2a2a] text-gray-400 border border-gray-600 hover:bg-[#2e2e2e]"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, position: "relative" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", width: "16px", height: "16px" }} />
            <input
              type="text"
              placeholder="Search chunks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-[#2a2a2a] border border-gray-600 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Scrollable List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", minHeight: 0 }}>
        {chunksLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span style={{ color: "#9ca3af", marginLeft: "12px" }}>Loading chunks...</span>
          </div>
        ) : filteredChunks.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <div style={{ textAlign: "center", color: "#6b7280" }}>
              <FileText style={{ width: "48px", height: "48px", margin: "0 auto 12px" }} />
              <p>No chunks found</p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredChunks.map((chunk) => (
              <div
                key={chunk.id}
                onClick={() => onSelectChunk(chunk)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedChunk?.id === chunk.id
                    ? "border-blue-400/50 bg-blue-500/5"
                    : "border-gray-600 bg-[#2a2a2a] hover:border-gray-500 hover:bg-[#2e2e2e]"
                }`}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {Array.isArray(chunk.type) && chunk.type.map((type: string) => (
                      <span
                        key={type}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          type === "text"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : type === "image"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        }`}
                      >
                        {type}
                      </span>
                    ))}
                    <span style={{ color: "#9ca3af", fontSize: "14px" }}>Page {chunk.page}</span>
                  </div>
                  <span style={{ color: "#9ca3af", fontSize: "14px" }}>{chunk.chars} chars</span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{chunk.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}