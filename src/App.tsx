import { ThemeProvider } from "@/components/theme-provider";

import AddTask from "./AddTask.tsx";
import { TasksProvider } from "./TaskContext.tsx";
import TaskView from "./TaskView.tsx";

function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <AddTask />
        <TaskView />
      </TasksProvider>
    </ThemeProvider>
  );
}

export default App;
