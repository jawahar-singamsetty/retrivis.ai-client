export const PROJECT_UPDATED_EVENT = "projectsUpdated";

export function dispatchProjectsUpdated() {
  window.dispatchEvent(new CustomEvent(PROJECT_UPDATED_EVENT));
}