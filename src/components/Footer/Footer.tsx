import { useTranslations } from "next-intl";
import Image from "next/image";
import Logo from "../../assets/rss-logo.svg";
import Github from "../Github/Github";
import styles from "./Footer.module.scss";
import { githubs } from "./consts";
import Link from "next/link";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div className={styles.footer__inner}>
          <div className={styles.footer__item}>
            <div className={styles.footer__githubs}>
              {githubs.map((item, index) => (
                <Github key={index} to={item.to} username={item.username} />
              ))}
            </div>
          </div>
          <div className={styles.footer__item}>
            <p className={styles.footer__copyright}>{t("message")}</p>
          </div>
          <div className={styles.footer__item}>
            <Link
              href="https://rs.school/courses/reactjs"
              target="blank"
              className={styles.logo}
            >
              <Image src={Logo} alt="logo" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
