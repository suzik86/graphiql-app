import { useTranslations } from "next-intl";
import styles from "./AboutCourseComponent.module.scss";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/rss-logo.svg";

const AboutCourseComponent = () => {
  const t = useTranslations("HomePage");
  return (
    <section className={styles.info}>
      <div className={styles.info__inner}>
        <h2 className={styles.info__title}>{t("about-course")}</h2>
        <div className={styles.info__content}>
          <Link
            href="https://rs.school/courses/reactjs"
            target="blank"
            className={styles.logo}
          >
            <Image src={Logo} alt="RSS logo" />
          </Link>
          <div className={styles.info__text}>
            <p className={styles.info__text__block}>{t("about-course-text")}</p>
            <p className={styles.info__text__block}>
              {t("about-course-text-2")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCourseComponent;
