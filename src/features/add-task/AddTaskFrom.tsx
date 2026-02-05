import { useState } from "react";
import { useTodoContext } from "@/entities/todo";
import Button from "@/shared/ui/Button";
import Field from "@/shared/ui/Field";
import styles from "./AddTaskForm.module.scss";

const AddTaskForm = () => {
  const [error, setError] = useState<string>("");
  const [newTask, setNewTask] = useState<string>("");

  const { addTask, newTaskInputRef } = useTodoContext();

  const clearNewTask = newTask.trim();
  const isNewTaskEmpty = clearNewTask.length === 0;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isNewTaskEmpty) {
      addTask(clearNewTask, () => setNewTask(""));
    }
  };

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const clearValue = value.trim();
    const hasOnlySpaces = value.length > 0 && clearValue.length === 0;

    setNewTask(value);
    setError(hasOnlySpaces ? "Задача не может быть пустой" : "");
  };

  return (
    <form
      className={styles.form}
      data-js-todo-new-task-form
      onSubmit={onSubmit}
    >
      <Field
        className={styles.field}
        label="New task title"
        id="new-task"
        value={newTask}
        onInput={onInput}
        ref={newTaskInputRef}
        error={error}
      />
      <Button type="submit" label="Add" isDisabled={isNewTaskEmpty} />
    </form>
  );
};

export default AddTaskForm;
