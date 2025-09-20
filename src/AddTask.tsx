import { nanoid } from "nanoid";
import { useContext } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  AppModeContext,
  defaultUIProps,
  TaskSearchContext,
  TasksContext,
  TasksFilterContext,
  TasksUIContext,
} from "./TaskContext";

export default function AddTask() {
  const { tasks, setTasks } = useContext(TasksContext);
  const { tasksUI, setTasksUI } = useContext(TasksUIContext);

  const { setMode } = useContext(AppModeContext);
  const { setFilter } = useContext(TasksFilterContext);
  const { text, setText } = useContext(TaskSearchContext);

  const addTask = () => {
    setText("");
    const id = nanoid();
    setTasks([...tasks, { id: id, content: text, done: false }]);
    setTasksUI({ ...tasksUI, [id]: defaultUIProps });
    setFilter("all");
    setMode("view");
  };

  return (
    <div className="flex justify-evenly m-3">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (text && e.key === "Enter") {
            e.preventDefault();
            addTask();
          }
        }}
      />
      <Button className="self-end-safe" disabled={!text} onClick={addTask}>
        Add
      </Button>
    </div>
  );
}
