import React, { useEffect } from "react";
import { useTasks } from "@/entities/todo";
import type { RouteParams } from "@/app/routing/Router";

interface TaskPageProps {
  params: RouteParams;
}

const TaskPage: React.FC<TaskPageProps> = (props) => {
  const { params } = props;

  const { getTask, task, loading, error } = useTasks();

  useEffect(() => {
    if (params.id) {
      void getTask(params.id);
    }
  }, [params, getTask]);

  if (loading) {
    return <div>Загрузка задачи...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!task) {
    return <div>Задача не найдена</div>;
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
