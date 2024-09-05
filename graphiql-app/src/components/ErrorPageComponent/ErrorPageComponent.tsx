import styles from "./ErrorPageComponent.module.scss";
import { useTranslations } from "next-intl";
interface ErrorProps {
  message: string;
  reset: () => void;
}
const ErrorPageComponent = ({ message, reset }: ErrorProps) => {
  const t = useTranslations("ErrorPage");
  return (
    <div className={styles.error}>
      <h1 className={styles.error__title}> {t("oops")}</h1>
      <p className={styles.error__text}>{message}</p>
      <button className={styles.error__btn} onClick={reset}>
        {t("retry")}
      </button>
    </div>
  );
};

export default ErrorPageComponent;
