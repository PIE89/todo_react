import React, { useEffect, useState } from "react";
import { type Task } from "@/entities/todo";
import type { RouteParams } from "@/app/routing/Router";
import taskAPI from "@/shared/api/tasks";

interface TaskPageProps {
  params: RouteParams;
}

const TaskPage: React.FC<TaskPageProps> = (props) => {
  const { params } = props;
  const taskID = params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchTask = async (taskID: string) => {
      try {
        const response = (await taskAPI.getTask(taskID)) as Response;

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Network Problems`);
        }
        const result: Task = await response.json();
        setTask(result);
      } catch (error) {
        setHasError(true);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask(taskID);
  }, [taskID]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (hasError) {
    return <div>Task not found!</div>;
  }

  if (!task) {
    return <div>No such task</div>;
  }

  return (
    <div>
      <h1>Детали задачи</h1>
      <p>ID: {task.id}</p>
      <p>Текст: {task.task}</p>
      <p>Статус: {task.isChecked ? "Выполнена" : "Не выполнена"}</p>
    </div>
  );
};

export default TaskPage;
