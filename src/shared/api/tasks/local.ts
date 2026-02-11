import type { Task } from "@/entities/todo";

interface TaskLocalApiInterface {
  getAll: () => Promise<Task[] | []>;
  getTask: (id: string) => Promise<Task | null>;
  addTask: (newTaskObj: Task) => Promise<Task>;
  toggleCompleteTask: (id: string, newChecked: boolean) => void;
  deleteTask: (id: string) => void;
  deleteAllTasks: () => void;
}

const STORAGE_KEY = "tasks";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (error: unknown) {
    console.log(error);
    return [];
  }
};

const write = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const delay = (ms = 150) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const localAPI: TaskLocalApiInterface = {
  getAll: () => {
    return read();
  },

  getTask: async (id) => {
    await delay();

    return read().find((task: Task) => task.id === id) ?? null;
  },

  addTask: async (newTaskObj) => {
    await delay();

    const newTask = {
      ...newTaskObj,
      id: crypto.randomUUID() ?? Date.now().toString(),
    };

    write([...read(), newTask]);

    return newTask;
  },

  toggleCompleteTask: async (id, newChecked) => {
    await delay();

    const tasks: Task[] = read().map((task: Task) => {
      if (task.id === id) {
        return { ...task, isChecked: newChecked };
      }
      return task;
    });

    write(tasks);
  },

  deleteTask: async (id) => {
    await delay();

    const tasks = read().filter((task: Task) => task.id !== id);
    write(tasks);
  },

  deleteAllTasks: async () => {
    await delay();

    write([]);
  },
};

export default localAPI;
