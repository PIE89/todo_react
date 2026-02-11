import type { Task } from "@/entities/todo";

interface ServerApiInterface {
  getAll: () => Promise<Response>;
  getTask: (id: string) => Promise<Response>;
  addTask: (newTaskObj: Task) => Promise<Response>;
  toggleCompleteTask: (id: string, newChecked: boolean) => Promise<Response>;
  deleteTask: (id: string) => Promise<Response>;
  deleteAllTasks: (tasks: Task[]) => Promise<Response[]>;
}

const URL: string = "http://localhost:3000/todos";

const headers = { "Content-Type": "application/json" };

const serverAPI: ServerApiInterface = {
  getAll: async () => {
    return await fetch(URL);
  },

  getTask: async (id) => {
    return await fetch(`${URL}/${id}`);
  },

  addTask: async (newTaskObj) => {
    return await fetch(URL, {
      method: "POST",
      headers,
      body: JSON.stringify(newTaskObj),
    });
  },

  toggleCompleteTask: async (id, newChecked) => {
    return await fetch(`${URL}/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isChecked: newChecked }),
    });
  },

  deleteTask: async (id) => {
    return await fetch(`${URL}/${id}`, {
      method: "DELETE",
      headers,
    });
  },

  deleteAllTasks: (tasks) => {
    return Promise.all(tasks.map(({ id }) => serverAPI.deleteTask(id)));
  },
};

export default serverAPI;
