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
  task: Task | null;
  filteredTasks: Task[];
  countOfDoneTasks: number;
  getTask: (id: string) => Promise<void>;
  addTask: (task: string, callbackAfterAdding: () => void) => Promise<void>;
  deleteAllTasks: () => Promise<void>;
  toggleCompleteTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  newTaskInputRef: React.RefObject<HTMLInputElement | null>;
  loading: boolean;
  disappearingTaskId: string | null;
  appearingTaskId: string | null;
  error: string | null;
}

type TasksAction =
  | { type: "SET_ALL"; tasks: Task[] }
  | { type: "ADD"; task: Task }
  | { type: "TOGGLE_COMPLETE"; id: string; isChecked: boolean }
  | { type: "DELETE"; id: string }
  | { type: "DELETE_ALL" };

const tasksReducer = (state: Task[], action: TasksAction): Task[] => {
  switch (action.type) {
    case "SET_ALL":
      return Array.isArray(action.tasks) ? action.tasks : state;
    case "ADD":
      return [...state, action.task];
    case "TOGGLE_COMPLETE":
      return state.map((task) =>
        task.id === action.id ? { ...task, isChecked: action.isChecked } : task
      );
    case "DELETE":
      return state.filter((task) => task.id !== action.id);
    case "DELETE_ALL":
      return [];
    default:
      return state;
  }
};

const useTasks = (): UseTasksReturn => {
  const [tasks, dispatch] = useReducer<Task[], [action: TasksAction]>(
    tasksReducer,
    []
  );
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [disappearingTaskId, setDisappearingTaskId] = useState<string | null>(
    null
  );
  const [appearingTaskId, setAppearingTaskId] = useState<string | null>(null);

  const newTaskInputRef = useRef<HTMLInputElement>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await taskAPI.getAll(controller.signal);

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Network Problems`);
      }

      const result: Task[] = await response.json();
      dispatch({ type: "SET_ALL", tasks: result });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (!loading) {
      newTaskInputRef.current?.focus();
    }
  }, [loading]);

  const countOfDoneTasks = useMemo(() => {
    return tasks.filter((item) => item.isChecked).length;
  }, [tasks]);

  const getTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await taskAPI.getTask(id);

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Network Problems`);
      }

      const result: Task = await response.json();
      setTask(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(
    async (task: string, callbackAfterAdding: () => void) => {
      const newTaskObj: Task = {
        id: crypto?.randomUUID() ?? Date.now().toString(),
        task,
        isChecked: false,
      };

      try {
        const response = await taskAPI.addTask(newTaskObj);

        if (!response.ok) {
          throw new Error("Network Problems");
        }

        dispatch({ type: "ADD", task: newTaskObj });

        callbackAfterAdding();
        newTaskInputRef.current?.focus();
        setAppearingTaskId(newTaskObj.id);

        setTimeout(() => {
          setAppearingTaskId(null);
        }, 400);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Error");
      }
    },
    []
  );

  const toggleCompleteTask = useCallback(async (id: string) => {
    try {
      const currentTask = tasks.find((t) => t.id === id);
      const newChecked = !currentTask?.isChecked;

      const response = await taskAPI.toggleCompleteTask(id, newChecked);

      if (!response.ok) {
        throw new Error("Network Problems");
      }
      dispatch({ type: "TOGGLE_COMPLETE", id: id, isChecked: newChecked });
    } catch (error: unknown) {
      if (typeof error === "string") {
        setError(error);
      }
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const response = await taskAPI.deleteTask(id);

      if (!response.ok) {
        throw new Error("Network Problems");
      } else {
        setDisappearingTaskId(id);

        setTimeout(() => {
          dispatch({ type: "DELETE", id: id });
          setDisappearingTaskId(null);
        }, 1000);
      }
    } catch (error) {
      if (typeof error === "string") {
        setError(error);
      }
    }
  }, []);

  const deleteAllTasks = useCallback(async () => {
    try {
      taskAPI.deleteAllTasks(tasks).then((responses) => {
        for (const response of responses) {
          if (!response.ok) {
            throw new Error("Network problems");
          }
        }
        dispatch({ type: "DELETE_ALL" });
      });
    } catch (error) {
      if (typeof error === "string") {
        setError(error);
      }
    }
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
    task,
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
  };
};

export default useTasks;
