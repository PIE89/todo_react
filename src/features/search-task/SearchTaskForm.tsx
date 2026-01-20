import Field from "@/shared/ui/Field";
import { useTodoContext } from "@/entities/todo";
import styles from "./SearchTaskForm.module.scss";

const SearchTaskForm = () => {
  const { searchQuery, setSearchQuery } = useTodoContext();

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearchQuery(value);
  };

  return (
    <form className={styles.form} data-js-todo-search-task-form>
      <Field
        className={styles.field}
        label="Search task"
        id="search-task"
        type="search"
        value={searchQuery}
        onInput={onInput}
      />
    </form>
  );
};

export default SearchTaskForm;
