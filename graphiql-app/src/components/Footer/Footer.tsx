import { useTranslations } from "next-intl";
import Image from "next/image";
import Logo from "../../assets/logo.png";
import Github from "../Github/Github";
import styles from "./Footer.module.scss";
import { githubs } from "./consts";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div className={styles.footer__inner}>
          <div className={styles.footer__item}>
            <div className={styles.footer__githubs}>
              {githubs.map((item) => (
                <Github to={item.to} username={item.username} />
              ))}
            </div>
          </div>
          <div className={styles.footer__item}>
            <p className={styles.footer__copyright}>{t("message")}</p>
          </div>
          <div className={styles.footer__item}>
            <Image src={Logo} alt="logo" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
