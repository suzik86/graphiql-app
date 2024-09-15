import { useTranslations } from "next-intl";
import Avatar from "../../assets/rss-logo.svg";
import MemberCard from "../MemberCard/MemberCard";
import styles from "./AboutUsComponent.module.scss";
import { members } from "./consts";

const AboutUsComponent = () => {
  const t = useTranslations("HomePage");
  return (
    <section className={styles.info}>
      <div className={styles.info__inner}>
        <h2 className={styles.info__title}>{t("about-us")}</h2>
        <div className={styles.info__images}>
          {members.map(({ id, name, describtion, link }) => (
            <MemberCard
              key={id}
              name={name}
              describtion={describtion}
              logo={Avatar}
              link={link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsComponent;
