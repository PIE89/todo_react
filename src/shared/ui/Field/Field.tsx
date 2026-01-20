import type { FC } from "react";
import styles from "./Field.module.scss";

interface FieldProps {
  className?: string;
  label: string;
  id: string;
  type?: "text" | "search";
  value?: string;
  onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.RefObject<HTMLInputElement | null>;
  error?: string;
}

const Field: FC<FieldProps> = (props) => {
  const {
    className = "",
    label,
    id,
    type = "text",
    value = "",
    onInput,
    ref,
    error = "",
  } = props;

  return (
    <div className={`${className} ${styles.field}`}>
      <label className={`${styles.label}`} htmlFor={id}>
        {label}
      </label>
      <input
        ref={ref}
        className={`${styles.input} ${error ? styles.isInvalid : ""}`}
        id={id}
        placeholder=" "
        autoComplete="off"
        data-js-todo-new-task-input
        type={type}
        value={value}
        onChange={onInput}
      />
      {error && (
        <span className={`${styles.error}`} title={error}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Field;
