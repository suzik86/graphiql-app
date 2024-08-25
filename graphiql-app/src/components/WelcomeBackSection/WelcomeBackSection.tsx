import { useLocale, useTranslations } from "next-intl";
import WelcomeButton from "../WelcomeButton/WelcomeButton";
import styles from "./WelcomeBackSection.module.scss";

const WelcomeBackSection = () => {
  const t = useTranslations("HomePage");
  const localActive = useLocale();

  const btns = [
    { link: "/", text: t("rest") },
    { link: `/${localActive}/GRAPHQL/{}`, text: t("graphiql") },
    { link: `/${localActive}/history`, text: t("history") },
  ];

  return (
    <section className={styles.welcome}>
      <div className={styles.welcome__inner}>
        <h1 className={styles.welcome__title}>
          {t("welcome")}
          <br />
          (username)!
        </h1>
        <h2 className={styles.welcome__subtitle}>{t("question")}</h2>

        <ul className={styles.welcome__btns}>
          {btns.map((item, index) => (
            <li key={index}>
              <WelcomeButton to={item.link} text={item.text} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WelcomeBackSection;
