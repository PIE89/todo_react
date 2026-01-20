import AddTaskForm from "@/features/add-task";
import SearchTaskForm from "@/features/search-task";
import TodoInfo from "@/features/stats";
import { useTodoContext } from "@/entities/todo";
import styles from "./Todo.module.scss";
import { TodoList } from "@/entities/todo";

const Todo = () => {
  const { loading, error, tasks } = useTodoContext();

  if (loading) {
    return <h1>LOADING...</h1>;
  }

  if (error) {
    return <h1>ERROR: {error}</h1>;
  }

  if (!tasks) {
    return <h1>ERROR 404</h1>;
  }

  return (
    <div className={styles.todo} data-js-todo>
      <h1 className={styles.title}>To Do List</h1>
      {loading && <h1>LOADING...</h1>}
      <AddTaskForm />
      <SearchTaskForm />
      <TodoInfo />
      <TodoList />
    </div>
  );
};

export { Todo };
