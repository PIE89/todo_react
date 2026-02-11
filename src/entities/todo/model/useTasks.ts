import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useReducer,
} from "react";
import { type Task } from "./TodoContext";
import taskAPI from "@/shared/api/tasks";

export interface UseTasksReturn {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  tasks: Task[];
  filteredTasks: Task[];
  countOfDoneTasks: number;
  addTask: (task: string, callbackAfterAdding: () => void) => Promise<void>;
  deleteAllTasks: () => Promise<void>;
  toggleCompleteTask: (id: string, isDone: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  newTaskInputRef: React.RefObject<HTMLInputElement | null>;
  disappearingTaskId: string | null;
  appearingTaskId: string | null;
}

type TasksAction =
  | { type: "SET_ALL"; tasks: Task[] }
  | { type: "ADD"; task: Task }
  | { type: "TOGGLE_COMPLETE"; id: string; isChecked: boolean }
  | { type: "DELETE"; id: string }
  | { type: "DELETE_ALL" };

const tasksReducer = (state: Task[], action: TasksAction): Task[] => {
  switch (action.type) {
    case "SET_ALL": {
      return Array.isArray(action.tasks) ? action.tasks : state;
    }
    case "ADD": {
      return [...state, action.task];
    }
    case "TOGGLE_COMPLETE": {
      const { id, isChecked } = action;

      return state.map((task) => {
        return task.id === id ? { ...task, isChecked } : task;
      });
    }
    case "DELETE": {
      return state.filter((task) => task.id !== action.id);
    }
    case "DELETE_ALL": {
      return [];
    }
    default: {
      return state;
    }
  }
};

const useTasks = (): UseTasksReturn => {
  const [tasks, dispatch] = useReducer<Task[], [action: TasksAction]>(
    tasksReducer,
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [disappearingTaskId, setDisappearingTaskId] = useState<string | null>(
    null
  );
  const [appearingTaskId, setAppearingTaskId] = useState<string | null>(null);
  const newTaskInputRef = useRef<HTMLInputElement>(null);

  const deleteAllTasks = useCallback(async () => {
    const isConfirmed = confirm("Are you sure you want to delete all?");

    if (isConfirmed) {
      await taskAPI.deleteAllTasks(tasks);
      dispatch({ type: "DELETE_ALL" });
    }
  }, [tasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const result = await taskAPI.deleteTask(taskId);
      if (result instanceof Response) {
        if (!result.ok) {
          throw new Error("Network Problems");
        }
      }

      setDisappearingTaskId(taskId);

      setTimeout(() => {
        dispatch({ type: "DELETE", id: taskId });
        setDisappearingTaskId(null);
      }, 400);
    } catch (error) {
      console.error("Delete task failed", error);
    }
  }, []);

  const toggleCompleteTask = useCallback(
    async (id: string) => {
      const currentTask = tasks.find((t) => t.id === id);
      if (!currentTask) return;

      const newChecked = !currentTask.isChecked;

      dispatch({ type: "TOGGLE_COMPLETE", id, isChecked: newChecked });

      try {
        const result = await taskAPI.toggleCompleteTask(id, newChecked);
        if (result instanceof Response && !result.ok) {
          throw new Error("Network Problems");
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: "TOGGLE_COMPLETE",
          id,
          isChecked: currentTask.isChecked,
        });
      }
    },
    [tasks]
  );

  const addTask = useCallback(
    async (task: string, callbackAfterAdding: () => void) => {
      const newTaskObj: Task = {
        id: crypto?.randomUUID() ?? Date.now().toString(),
        task,
        isChecked: false,
      };

      const result = await taskAPI.addTask(newTaskObj);

      if (result instanceof Response) {
        if (!result.ok) throw new Error("Network Problems");
        const savedTask: Task = await result.json();
        dispatch({ type: "ADD", task: savedTask });
      } else {
        dispatch({ type: "ADD", task: result as Task });
      }

      callbackAfterAdding();
      setSearchQuery("");
      newTaskInputRef.current?.focus();
      setAppearingTaskId(newTaskObj.id);
      setTimeout(() => {
        setAppearingTaskId(null);
      }, 400);
    },
    []
  );

  const fetchTasks = useCallback(async () => {
    const result = await taskAPI.getAll();

    if (result instanceof Response) {
      if (!result.ok) {
        throw new Error(`HTTP ${result.status}: Network Problems`);
      }
      const tasks: Task[] = await result.json();
      dispatch({ type: "SET_ALL", tasks });
    } else {
      dispatch({ type: "SET_ALL", tasks: result as Task[] });
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    newTaskInputRef.current?.focus();
  }, [fetchTasks]);

  const countOfDoneTasks = useMemo(() => {
    return tasks.filter((item) => item.isChecked).length;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query.length === 0
      ? tasks
      : tasks.filter((task) => task.task.toLowerCase().includes(query));
  }, [searchQuery, tasks]);

  return {
    // Состояние
    searchQuery,
    setSearchQuery,

    // Данные
    tasks,
    // task,
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
  };
};

export default useTasks;
