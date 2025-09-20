import { SquarePen, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.tsx";
import { cn } from "@/lib/utils.ts";
import { AppModeContext, TasksContext, TasksUIContext } from "./TaskContext";
import type { Task, TaskWithUI } from "./types.ts";

export default function TaskList({ tasks }: { tasks: TaskWithUI[] }) {
  const { mode } = useContext(AppModeContext);

  return (
    <ul>
      {tasks.map((task) => (
        <li
          className={cn(
            "grid items-center m-2",
            mode === "view"
              ? "grid-cols-[1fr_7fr_1fr_1fr]"
              : mode === "select"
                ? "grid-cols-[1fr_9fr]"
                : "",
          )}
          key={task.id}
        >
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

// biome-ignore lint/suspicious/noRedeclare: component name vs type name
function Task({ task }: { task: TaskWithUI }) {
  const { tasks, setTasks } = useContext(TasksContext);
  const { tasksUI, setTasksUI } = useContext(TasksUIContext);
  const [isEditing, setIsEditing] = useState(false);

  const { mode } = useContext(AppModeContext);

  function onTaskChange(task: Task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      }),
    );
  }
  return (
    <>
      {mode === "select" && (
        <Checkbox
          id={`selected${task.id}`}
          checked={task.selected}
          onCheckedChange={(checked) =>
            setTasksUI({
              ...tasksUI,
              [task.id]: { ...tasksUI[task.id], selected: checked === true },
            })
          }
        />
      )}
      {mode === "view" && (
        <Checkbox
          className="justify-self-center"
          id={`completed${task.id}`}
          checked={task.done}
          onCheckedChange={(checked) =>
            onTaskChange({ ...task, done: checked === true })
          }
        />
      )}
      {isEditing && mode === "view" && (
        <>
          <Input
            type="text"
            value={task.content}
            onChange={(e) => onTaskChange({ ...task, content: e.target.value })}
          />
          <Button
            variant="secondary"
            onClick={() => {
              onTaskChange(task);
              setIsEditing(false);
            }}
          >
            Save
          </Button>
        </>
      )}
      {!isEditing && (
        <Label
          className={cn("wrap-anywhere", task.done && "opacity-25")}
          htmlFor={
            (mode === "view"
              ? "completed"
              : mode === "select"
                ? "selected"
                : "") + task.id
          }
        >
          {task.content}
        </Label>
      )}
      {!isEditing && mode === "view" && (
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setIsEditing(true)}
        >
          <SquarePen />
        </Button>
      )}
      {mode === "view" && (
        <Button
          size="icon"
          variant="destructive"
          onClick={() => {
            setTasks(tasks.filter((t) => t.id !== task.id));
            const { [task.id]: _, ...rest } = tasksUI;
            setTasksUI(rest);
          }}
        >
          <Trash2 />
        </Button>
      )}
    </>
  );
}
