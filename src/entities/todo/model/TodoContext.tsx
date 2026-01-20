import { createContext, useContext } from "react";
import type { UseTasksReturn } from "./useTasks";

export interface Task {
  id: string;
  task: string;
  isChecked: boolean;
}

export const TodoContext = createContext<UseTasksReturn | null>(null);

export const useTodoContext = (): UseTasksReturn => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within TodoContextProvider");
  }
  return context;
};
