import styles from "./AboutUsComponent.module.scss";
import Avatar from "../../assets/rss-logo.svg";
import { members } from "./consts";
import MemberCard from "../MemberCard/MemberCard";
import { useTranslations } from "next-intl";
const AboutUsComponent = () => {
  const t = useTranslations("HomePage");
  return (
    <section className={styles.info}>
      <div className={styles.info__inner}>
        <h2 className={styles.info__title}>{t("about-us")}</h2>
        <div className={styles.info__images}>
          {members.map((item) => (
            <MemberCard
              name={item.name}
              describtion={item.describtion}
              logo={Avatar}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsComponent;
