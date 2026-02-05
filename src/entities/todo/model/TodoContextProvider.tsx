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
    task,
    tasks,
    filteredTasks,
    countOfDoneTasks,
    disappearingTaskId,
    appearingTaskId,

    // Действия
    getTask,
    addTask,
    toggleCompleteTask,
    deleteTask,
    deleteAllTasks,

    // UI состояние
    newTaskInputRef,
    loading,
    error,
  } = useTasks();

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,

      // Данные
      task,
      tasks,
      filteredTasks,
      countOfDoneTasks,
      disappearingTaskId,
      appearingTaskId,

      // Действия
      getTask,
      addTask,
      toggleCompleteTask,
      deleteTask,
      deleteAllTasks,

      // UI состояние
      newTaskInputRef,
      loading,
      error,
    }),
    [
      searchQuery,
      setSearchQuery,

      // Данные
      task,
      tasks,
      filteredTasks,
      countOfDoneTasks,
      disappearingTaskId,
      appearingTaskId,

      // Действия
      getTask,
      addTask,
      toggleCompleteTask,
      deleteTask,
      deleteAllTasks,

      // UI состояние
      newTaskInputRef,
      loading,
      error,
    ]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
