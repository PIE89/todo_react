import { memo } from "react";
import { useTodoContext } from "@/entities/todo";
import styles from "./TodoInfo.module.scss";

const TodoInfo = () => {
  const { countOfDoneTasks, tasks, deleteAllTasks } = useTodoContext();

  const hasTasks = tasks.length > 0;

  return (
    <div className={styles.info}>
      <div className={styles.totalTasks}>
        Done {countOfDoneTasks} from {tasks.length}
      </div>
      {hasTasks && (
        <button
          className={styles.deleteAllButton}
          type="button"
          data-js-todo-delete-all-button
          onClick={deleteAllTasks}
        >
          Delete all
        </button>
      )}
    </div>
  );
};

export default memo(TodoInfo);
