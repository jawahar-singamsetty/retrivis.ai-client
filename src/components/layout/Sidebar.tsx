"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import {
  Plus,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  FolderOpen,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { PROJECT_UPDATED_EVENT } from "@/lib/projectEvents";

interface Project {
  id: string;
  name: string;
  created_at: string;
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { getToken } = useAuth();

  const currentProjectId = pathname.startsWith("/projects/")
    ? pathname.split("/")[2]
    : null;

  // ─── Fetch Projects ──────────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoadingProjects(true);
      const token = await getToken();
      const data = await apiClient.get("/api/projects", token);
      const projectList = Array.isArray(data) ? data : data.data ?? [];
      const sorted = [...projectList].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setProjects(sorted);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Add this AFTER the existing useEffect that calls fetchProjects
  useEffect(() => {
    window.addEventListener(PROJECT_UPDATED_EVENT, fetchProjects);
    return () => {
      window.removeEventListener(PROJECT_UPDATED_EVENT, fetchProjects);
    };
  }, [fetchProjects]);

  // ─── Create Project ──────────────────────────────────────────────────────
  const handleCreateProject = async (name: string, description: string) => {
    try {
      setIsCreating(true);
      const token = await getToken();
      const newProject = await apiClient.post(
        "/api/projects",
        { name, description },
        token
      );
      const created = newProject.data ?? newProject;
      setProjects((prev) => [created, ...prev]);
      setIsModalOpen(false);
      router.push(`/projects/${created.id}`);
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div
        className={`bg-[#1a1a1a] text-white flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="p-3 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-lg font-medium text-gray-200">Retrivis.AI</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-[#252525] rounded-md transition-colors"
          >
            {isCollapsed ? (
              <PanelLeftOpen size={16} className="text-gray-400" />
            ) : (
              <PanelLeftClose size={16} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* New Project Button */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`w-full bg-[#252525] hover:bg-[#2a2a2a] border border-gray-700 hover:border-gray-600 rounded-lg transition-colors flex items-center gap-3 ${
              isCollapsed ? "p-3 justify-center" : "p-3"
            }`}
          >
            <Plus size={16} className="text-gray-400" />
            {!isCollapsed && (
              <span className="text-sm text-gray-200">New project</span>
            )}
          </button>
        </div>

        {/* Projects Nav Header */}
        {!isCollapsed && (
          <div className="px-3 pb-1">
            <button
              onClick={() => router.push("/projects")}
              className={`w-full flex items-center gap-3 p-2 text-sm rounded-md transition-colors ${
                pathname === "/projects"
                  ? "bg-[#252525] text-gray-200 border border-gray-700"
                  : "text-gray-400 hover:bg-[#252525] hover:text-gray-200"
              }`}
            >
              <Briefcase size={16} />
              <span className="text-sm font-medium">Projects</span>
            </button>
          </div>
        )}

        {/* Project List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {!isCollapsed && (
            <>
              {isLoadingProjects ? (
                <div className="space-y-1 mt-1 pl-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-7 bg-[#252525] rounded-md animate-pulse"
                    />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <p className="text-xs text-gray-600 pl-7 mt-1">
                  No projects yet
                </p>
              ) : (
                <>
                  {/* Section Label */}
                  <div className="px-2 pt-2 pb-1">
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Your Projects
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-800 mb-1" />

                  {/* Project Items */}
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() =>
                          router.push(`/projects/${project.id}`)
                        }
                        className={`w-full flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-md transition-colors text-left group ${
                          currentProjectId === project.id
                            ? "bg-[#252525] text-gray-200 border border-gray-700"
                            : "text-gray-400 hover:bg-[#252525] hover:text-gray-300"
                        }`}
                      >
                        {/* Indent indicator */}
                        <div
                          className={`w-px h-4 rounded-full shrink-0 ${
                            currentProjectId === project.id
                              ? "bg-blue-400"
                              : "bg-gray-700 group-hover:bg-gray-500"
                          }`}
                        />
                        <FolderOpen
                          size={13}
                          className={`shrink-0 ${
                            currentProjectId === project.id
                              ? "text-blue-400"
                              : "text-gray-600 group-hover:text-gray-400"
                          }`}
                        />
                        <span className="truncate text-base">
                          {project.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Collapsed: folder icons only */}
          {isCollapsed && (
            <div className="space-y-1 mt-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  title={project.name}
                  className={`w-full flex justify-center p-3 rounded-md transition-colors ${
                    currentProjectId === project.id
                      ? "bg-[#252525] text-blue-400"
                      : "text-gray-600 hover:bg-[#252525] hover:text-gray-400"
                  }`}
                >
                  <FolderOpen size={16} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="p-3 border-t border-gray-800">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <UserButton />
            {!isCollapsed && (
              <span className="text-sm text-gray-400">Profile</span>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
        isLoading={isCreating}
      />
    </>
  );
}