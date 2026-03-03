"use client";

import { useState } from "react";
import { Plus, Search, Grid3X3, List, Folder, Trash2, Pencil, X, Sparkles } from "lucide-react";
import { Project } from "@/lib/types";

// ─── Edit Modal ──────────────────────────────────────────────────────────────
interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (id: string, name: string, description: string) => Promise<void>;
  isLoading: boolean;
}

function EditProjectModal({
  isOpen,
  project,
  onClose,
  onSave,
  isLoading,
}: EditProjectModalProps) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");

  // Sync fields when project changes
  if (project && name === "" && project.name) {
    setName(project.name);
    setDescription(project.description ?? "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !name.trim()) return;
    await onSave(project.id, name.trim(), description.trim());
  };

  const handleClose = () => {
    setName(project?.name ?? "");
    setDescription(project?.description ?? "");
    onClose();
  };

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <Pencil size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Edit project</h2>
              <p className="text-sm text-gray-400">Update project details</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-300 transition-colors p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Project name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 disabled:opacity-50 text-white placeholder-gray-500 transition-all duration-200"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Description
              <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 disabled:opacity-50 text-white placeholder-gray-500 resize-none transition-all duration-200"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-300 bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50 border border-gray-700 rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-1 px-4 py-3 bg-white hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 text-black rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
interface ProjectsGridProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  viewMode: "grid" | "list";
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onProjectClick: (projectId: string) => void;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onEditProject: (id: string, name: string, description: string) => Promise<void>;
}

export function ProjectsGrid({
  projects,
  loading,
  error,
  searchQuery,
  viewMode,
  onSearchChange,
  onViewModeChange,
  onProjectClick,
  onCreateProject,
  onDeleteProject,
  onEditProject,
}: ProjectsGridProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const handleEditSave = async (id: string, name: string, description: string) => {
    try {
      setIsEditLoading(true);
      await onEditProject(id, name, description);
      setEditingProject(null);
    } catch (err) {
      console.error("Failed to edit project:", err);
    } finally {
      setIsEditLoading(false);
    }
  };

  // ─── Action Buttons (reused in both grid and list) ───────────────────────
  const ActionButtons = ({ project, absolute = false }: { project: Project; absolute?: boolean }) => (
    <div
      className="flex items-center gap-1"
      style={absolute ? { position: "absolute", top: "12px", right: "12px" } : {}}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEditingProject(project);
        }}
        className="p-1.5 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Edit project"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#4ade80";
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(74, 222, 128, 0.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
        style={{ color: "#6b7280" }}
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteProject(project.id);
        }}
        className="p-1.5 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Delete project"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(248, 113, 113, 0.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
        style={{ color: "#6b7280" }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        {/* Header */}
        <div className="h-6 bg-[#0f0f0f]"></div>
        <div className="bg-[#0f0f0f]/95 backdrop-blur-sm sticky top-6 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-medium text-white tracking-tight">
                  Projects
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {projects.length} project{projects.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={onCreateProject}
                disabled={loading}
                className="bg-white hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-500 text-black px-4 py-2.5 rounded-full flex items-center gap-2 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                <Plus size={16} />
                Create new
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent placeholder-gray-500 text-white text-sm disabled:opacity-50 transition-all duration-200"
                />
              </div>
              <div className="flex items-center bg-gray-900/50 border border-gray-800 rounded-lg p-1">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-1.5 rounded transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-gray-700 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className={`p-1.5 rounded transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-gray-700 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              {searchQuery ? (
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Search size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">
                    No projects found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search terms or create a new project
                  </p>
                  <button
                    onClick={() => onSearchChange("")}
                    className="text-gray-300 hover:text-white text-sm underline underline-offset-4"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <Plus size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-3">
                    Create your first project
                  </h3>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Projects help you organize your documents and conversations.
                    Start by creating your first project.
                  </p>
                  <button
                    onClick={onCreateProject}
                    className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-full transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create your first project
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-300 mb-4">
                  Recent projects
                </h2>

                {viewMode === "grid" ? (
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(250px, 1fr))",
                    }}
                  >
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => onProjectClick(project.id)}
                        className="group bg-gray-900/50 hover:bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 relative"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                          <Folder size={24} className="text-gray-400" />
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium text-white text-base line-clamp-2">
                            {project.name}
                          </h3>
                          {project.description && (
                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                              {project.description}
                            </p>
                          )}
                          <div className="pt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(project.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Edit + Delete buttons */}
                          <ActionButtons project={project} absolute={true} />
                        
                      </div>
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => onProjectClick(project.id)}
                        className="group flex items-center gap-4 bg-gray-900/50 hover:bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Folder size={20} className="text-gray-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {project.name}
                          </h3>
                          {project.description && (
                            <p className="text-gray-400 text-sm truncate mt-1">
                              {project.description}
                            </p>
                          )}
                        </div>

                        <span className="text-xs text-gray-500 flex-shrink-0 self-start">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>

                        {/* Edit + Delete buttons */}
                        <ActionButtons project={project} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditProjectModal
        isOpen={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onSave={handleEditSave}
        isLoading={isEditLoading}
      />
    </>
  );
}