import { useSyncExternalStore } from "react";
import type { Task } from "./types";

const STORAGE_KEY = "task-tracker:tasks";
let tasks: Task[] = [];

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot() {
  try {
    const tasksString = localStorage.getItem(STORAGE_KEY);
    if (tasksString !== null) {
      const oldString = JSON.stringify(tasks);
      if (tasksString === oldString) {
        return tasks;
      } else {
        const newTasks: Task[] = JSON.parse(tasksString);
        tasks = newTasks;
        return newTasks;
      }
    }
  } catch (e) {
    console.error("Failed to get item in localStorage", e);
  }
  return tasks;
}

function saveTasks(tasks: Task[]) {
  try {
    const newValue = JSON.stringify(tasks);
    if (localStorage.getItem(STORAGE_KEY) !== newValue) {
      localStorage.setItem(STORAGE_KEY, newValue);
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
    }
  } catch (e) {
    console.error("Failed to set item in localStorage", e);
  }
}

export function useLocalStorage() {
  const tasks = useSyncExternalStore(subscribe, getSnapshot);
  return [tasks, saveTasks] as const;
}
