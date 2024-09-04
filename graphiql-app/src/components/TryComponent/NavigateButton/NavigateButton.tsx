import Link from "next/link";
import styles from "./NavigateButton.module.scss";
import { useLocale, useTranslations } from "next-intl";
const NavigateButton = () => {
  const t = useTranslations("HomePage");
  const localActive = useLocale();
  return (
    <Link href={`/${localActive}/register`} className={styles.btn}>
      <p className={styles.btn__inner}>{t("try")}</p>
    </Link>
  );
};
export default NavigateButton;
