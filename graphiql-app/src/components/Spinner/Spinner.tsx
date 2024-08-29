import styles from "./Spinner.module.scss";

const Spinner = () => {
  return (
    <div className={styles.spinner__wrapper}>
      <div className={styles.spinner}>
        <div className={styles.left}>
          <div className={`${styles.spinner__item} ${styles.first}`} />

          <div className={`${styles.spinner__item} ${styles.second}`} />

          <div className={`${styles.spinner__item} ${styles.third}`} />
        </div>
        <div className={styles.right}>
          <div className={`${styles.spinner__item} ${styles.first}`} />

          <div className={`${styles.spinner__item} ${styles.second}`} />

          <div className={`${styles.spinner__item} ${styles.third}`} />
        </div>
        <div className={styles.triangle}>
          <div
            className={`${styles.triangle__item} ${styles.triangle__first} `}
          />
          <div
            className={`${styles.triangle__item} ${styles.triangle__second} `}
          />
          <div
            className={`${styles.triangle__item} ${styles.triangle__third} `}
          />
        </div>
        <div className={styles.spinner__dots}>
          <div className={`${styles.spinner__dot} ${styles.dot__first}`} />
          <div className={`${styles.spinner__dot} ${styles.dot__second}`} />
          <div className={`${styles.spinner__dot} ${styles.dot__third}`} />
          <div className={`${styles.spinner__dot} ${styles.dot__fourth}`} />
          <div className={`${styles.spinner__dot} ${styles.dot__fifth}`} />
          <div className={`${styles.spinner__dot} ${styles.dot__sixth}`} />
        </div>
      </div>
    </div>
  );
};

export default Spinner;
