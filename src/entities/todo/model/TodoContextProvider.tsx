import React, { useMemo, type FC } from "react";
import { TodoContext } from "./TodoContext";
import useTasks from "./useTasks";

interface TodoContextProviderProps {
  children: React.ReactNode;
}

export const TodoContextProvider: FC<TodoContextProviderProps> = ({
  children,
}) => {
  const {
    searchQuery,
    setSearchQuery,

    // Данные
    // task,
    tasks,
    filteredTasks,
    countOfDoneTasks,
    disappearingTaskId,
    appearingTaskId,

    // Действия
    addTask,
    toggleCompleteTask,
    deleteTask,
    deleteAllTasks,

    // UI состояние
    newTaskInputRef,
  } = useTasks();

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,

      // Данные
      // task,
      tasks,
      filteredTasks,
      countOfDoneTasks,
      disappearingTaskId,
      appearingTaskId,

      // Действия
      addTask,
      toggleCompleteTask,
      deleteTask,
      deleteAllTasks,

      // UI состояние
      newTaskInputRef,
    }),
    [
      searchQuery,
      setSearchQuery,

      // Данные
      // task,
      tasks,
      filteredTasks,
      countOfDoneTasks,
      disappearingTaskId,
      appearingTaskId,

      // Действия
      addTask,
      toggleCompleteTask,
      deleteTask,
      deleteAllTasks,

      // UI состояние
      newTaskInputRef,
    ]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
