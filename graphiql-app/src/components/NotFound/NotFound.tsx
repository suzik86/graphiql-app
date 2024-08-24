import Link from "next/link";
import styles from "./NotFound.module.scss";

const NotFoundComponent = () => {
  return (
    <div className={styles.not}>
      <h1 className={styles.not__title}>404</h1>
      <p className={styles.not__text}>Page not found</p>
      <Link className={styles.not__btn} href="/">
        Back to home
      </Link>
    </div>
  );
};

export default NotFoundComponent;
