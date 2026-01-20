import { memo } from "react";
import { useTodoContext } from "@/entities/todo";
import styles from "./TodoList.module.scss";
import TodoItem from "../TodoItem";

const TodoList = () => {
  const { tasks, filteredTasks } = useTodoContext();

  const hasTasks = tasks.length > 0;
  const emptyFilteredTasks = filteredTasks?.length === 0;

  if (!hasTasks) {
    return (
      <div className={styles.emptyMessage} data-js-todo-empty-message>
        {"Нет ни одной заполненной задачи"}
      </div>
    );
  }

  if (emptyFilteredTasks && hasTasks) {
    return (
      <div className={styles.emptyMessage} data-js-todo-empty-message>
        {"Фильтр пуст"}
      </div>
    );
  }

  return (
    <ul className={styles.list} data-js-todo-list>
      {(filteredTasks ?? tasks).map((taskItem) => (
        <TodoItem {...taskItem} key={taskItem.id} />
      ))}
    </ul>
  );
};

export default memo(TodoList);
