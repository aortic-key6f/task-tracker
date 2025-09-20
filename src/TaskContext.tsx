import type React from "react";
import { createContext, useState } from "react";
import type { AppMode, Task, TaskFilter, TaskUI, TaskWithUI } from "./types.ts";
import { useLocalStorage } from "./useLocalStorage.ts";

type TaskProviderState = {
  tasks: Task[];
  setTasks: ReturnType<typeof useLocalStorage>[1];
};
const taskInitialState: TaskProviderState = {
  tasks: [],
  setTasks: () => {},
};
export const TasksContext = createContext<TaskProviderState>(taskInitialState);

type TaskUIProviderState = {
  tasksUI: TaskUI;
  setTasksUI: React.Dispatch<React.SetStateAction<TaskUI>>;
};
const taskUIInitialState: TaskUIProviderState = {
  tasksUI: {},
  setTasksUI: () => {},
};
export const TasksUIContext =
  createContext<TaskUIProviderState>(taskUIInitialState);
export const defaultUIProps: TaskUI[keyof TaskUI] = { selected: false };

export const TasksWithUIContent = createContext<TaskWithUI[]>([]);

type AppModeProviderState = {
  mode: AppMode;
  setMode: React.Dispatch<React.SetStateAction<AppMode>>;
};
const appModeInitialState: AppModeProviderState = {
  mode: "view",
  setMode: () => {},
};
export const AppModeContext =
  createContext<AppModeProviderState>(appModeInitialState);

type TaskFilterProviderState = {
  filter: TaskFilter;
  setFilter: React.Dispatch<React.SetStateAction<TaskFilter>>;
};
const taskFilterInitialState: TaskFilterProviderState = {
  filter: "all",
  setFilter: () => {},
};
export const TasksFilterContext = createContext<TaskFilterProviderState>(
  taskFilterInitialState,
);

type TaskSearchProviderState = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};
const taskSearchInitialState: TaskSearchProviderState = {
  text: "",
  setText: () => {},
};
export const TaskSearchContext = createContext<TaskSearchProviderState>(
  taskSearchInitialState,
);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useLocalStorage();
  const [tasksUI, setTasksUI] = useState<TaskUI>(
    Object.fromEntries(tasks.map((task) => [task.id, defaultUIProps])),
  );

  const [mode, setMode] = useState<AppMode>("view");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [text, setText] = useState("");

  const tasksWithUI = tasks.map((task) => ({
    ...task,
    ...(tasksUI[task.id] ?? defaultUIProps),
  }));
  return (
    <TasksContext value={{ tasks, setTasks }}>
      <TasksUIContext value={{ tasksUI, setTasksUI }}>
        <TasksWithUIContent value={tasksWithUI}>
          <AppModeContext value={{ mode, setMode }}>
            <TasksFilterContext value={{ filter, setFilter }}>
              <TaskSearchContext value={{ text, setText }}>
                {children}
              </TaskSearchContext>
            </TasksFilterContext>
          </AppModeContext>
        </TasksWithUIContent>
      </TasksUIContext>
    </TasksContext>
  );
}
