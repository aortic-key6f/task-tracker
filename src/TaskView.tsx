import { Menu } from "lucide-react";
import { useContext } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import {
  AppModeContext,
  TaskSearchContext,
  TasksContext,
  TasksFilterContext,
  TasksUIContext,
  TasksWithUIContent,
} from "./TaskContext";
import TaskList from "./TaskList";

export default function TaskView() {
  const { tasks, setTasks } = useContext(TasksContext);
  const { tasksUI, setTasksUI } = useContext(TasksUIContext);

  const { mode, setMode } = useContext(AppModeContext);
  const { filter, setFilter } = useContext(TasksFilterContext);
  const { text } = useContext(TaskSearchContext);

  const tasksWithUI = useContext(TasksWithUIContent);
  const filteredTasks = tasksWithUI
    .filter((task) => {
      switch (filter) {
        case "active": {
          return task.done === false;
        }
        case "completed": {
          return task.done === true;
        }
        case "selected": {
          return task.selected === true;
        }
        case "unselected": {
          return task.selected === false;
        }
        default: {
          return true;
        }
      }
    })
    .filter((task) => task.content.toLowerCase().includes(text.toLowerCase()));

  const allSelected = filteredTasks.length
    ? filteredTasks.map((task) => task.selected).every(Boolean)
    : false;
  const anySelected = tasksWithUI.length
    ? tasksWithUI.map((task) => task.selected).some(Boolean)
    : false;

  function onDelete() {
    setTasks([
      ...tasks.filter((task) => {
        const taskUI = tasksUI[task.id] ?? {};
        return taskUI.selected === false;
      }),
    ]);
    setFilter("all");
    setMode("view");
  }

  function onComplete() {
    setTasks([
      ...tasks.map((task) => {
        const taskUI = tasksUI[task.id] ?? {};
        if (taskUI.selected === true) {
          return { ...task, done: true };
        } else {
          return task;
        }
      }),
    ]);
    setFilter("all");
    setMode("view");
  }

  return (
    <>
      <div className="flex items-center m-2">
        <div className="grow-2 flex justify-center">
          {mode === "view" && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setMode("select");
                    setFilter("all");
                  }}
                >
                  Select Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {mode === "select" && (
            <Checkbox
              checked={
                allSelected ? true : anySelected ? "indeterminate" : false
              }
              onCheckedChange={(checked) =>
                filteredTasks.map((task) =>
                  setTasksUI((tasksUI) => ({
                    ...tasksUI,
                    [task.id]: {
                      ...tasksUI[task.id],
                      selected: checked === true,
                    },
                  })),
                )
              }
            />
          )}
        </div>
        <ButtonFilter />
      </div>

      <TaskList tasks={filteredTasks} />

      {mode === "select" && (
        <div className="flex justify-around">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={!anySelected}>
                Mark as
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ConfirmDialog name="Completed" onYesHandler={onComplete} />
              <ConfirmDialog name="Deleted" onYesHandler={onDelete} />
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => {
              setMode("view");
              setTasksUI(
                Object.fromEntries(
                  Object.entries(tasksUI).map(([id, ui]) => [
                    id,
                    { ...ui, selected: false },
                  ]),
                ),
              );
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </>
  );
}

function ButtonFilter() {
  const { mode } = useContext(AppModeContext);
  const { setFilter } = useContext(TasksFilterContext);
  return (
    <div className="grow-8 flex justify-evenly">
      <Button onClick={() => setFilter("all")}>All</Button>
      {mode === "view" ? (
        <>
          <Button onClick={() => setFilter("active")}>Active</Button>
          <Button onClick={() => setFilter("completed")}>Completed</Button>
        </>
      ) : (
        <>
          <Button onClick={() => setFilter("selected")}>Selected</Button>
          <Button onClick={() => setFilter("unselected")}>Unselected</Button>
        </>
      )}
    </div>
  );
}

function ConfirmDialog({
  name,
  onYesHandler,
}: {
  name: string;
  onYesHandler: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {name}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Mark as ${name}`}</DialogTitle>
          <DialogDescription>{`Are you sure you want to mark all selected tasks as ${name}?`}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onYesHandler}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
