import { type FC } from "react";
import { useTodoContext } from "@/entities/todo";
import RouterLink from "@/shared/ui/RouterLink";
import styles from "./TodoItem.module.scss";

interface TodoItemProps {
  className?: string;
  id: string;
  isChecked: boolean;
  task: string;
}

const TodoItem: FC<TodoItemProps> = ({
  id,
  isChecked,
  task,
  className = "",
}) => {
  const {
    toggleCompleteTask,
    deleteTask,
    disappearingTaskId,
    appearingTaskId,
  } = useTodoContext();

  return (
    <li
      className={`${styles.item} ${className} ${
        disappearingTaskId === id ? styles.isDisappearing : ""
      }
        ${appearingTaskId === id ? styles.isAppearing : ""}
      }`}
      data-js-todo-item
    >
      <input
        className={`${styles.checkbox}`}
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={() => toggleCompleteTask(id)}
        data-js-todo-item-checkbox
      />
      <label
        className={`${styles.label} visually-hidden`}
        htmlFor={id}
        data-js-todo-item-label
      >
        {task}
      </label>
      <RouterLink to={`/tasks/${id}`} aria-label="Task detail page">
        {task}
      </RouterLink>
      <button
        className={`${styles.deleteButton}`}
        data-js-todo-item-delete-button
        aria-label="Delete"
        title="Delete"
        onClick={() => deleteTask(id)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="#757575"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  );
};

export default TodoItem;
