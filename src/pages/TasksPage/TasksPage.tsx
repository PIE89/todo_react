import { TodoContextProvider } from "@/entities/todo";
import { Todo } from "@/widgets/Todo";

const TasksPage = () => {
  return (
    <TodoContextProvider>
      <Todo />
    </TodoContextProvider>
  );
};

export default TasksPage;
