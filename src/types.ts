export type Task = {
  id: string;
  content: string;
  done: boolean;
};
export type TaskUI = Record<Task["id"], { selected: boolean }>;
export type TaskWithUI = Task & TaskUI[keyof TaskUI];

export type AppMode = "select" | "view";
export type TaskFilter =
  | "all"
  | "active"
  | "completed"
  | "selected"
  | "unselected";
