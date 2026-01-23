import Router from "./routing/Router";
import TaskPage from "@/pages/TaskPage";
import TasksPage from "@/pages/TasksPage";
import "./styles";
import type { ComponentType } from "react";

const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routes: Record<string, ComponentType<any>> = {
    "/todo_react/": TasksPage,
    "/todo_react/tasks/:id": TaskPage,
    "*": () => <div>404 page not found</div>,
  };

  return <Router routes={routes} />;
};

export default App;
