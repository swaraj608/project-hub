import type { Project } from "./projects";

export type Task = {
  id: number;
  title: string;
  done: boolean;
  priority: "High" | "Medium" | "Low";
};

export const PROJECTS_KEY = "project-hub-projects";
export const TASKS_KEY = "project-hub-tasks";

export function readProjects(fallback: Project[] = []): Project[] {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = localStorage.getItem(PROJECTS_KEY);
    return saved ? (JSON.parse(saved) as Project[]) : fallback;
  } catch {
    return fallback;
  }
}

export function saveProjects(projects: Project[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }
}

export function readTasks(fallback: Task[] = []): Task[] {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = localStorage.getItem(TASKS_KEY);
    return saved ? (JSON.parse(saved) as Task[]) : fallback;
  } catch {
    return fallback;
  }
}

export function saveTasks(tasks: Task[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
}
