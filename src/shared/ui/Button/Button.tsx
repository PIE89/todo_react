import styles from "./Button.module.scss";

interface ButtonProps {
  type: "submit" | "button";
  isLabelHidden?: boolean;
  label: string;
  className?: string;
  isDisabled: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    type,
    isLabelHidden = false,
    label,
    className = "",
    isDisabled,
  } = props;

  return (
    <button
      className={`${styles.button} ${className}`}
      type={type}
      title={type}
      disabled={isDisabled}
    >
      {!isLabelHidden && label}
    </button>
  );
};

export default Button;
