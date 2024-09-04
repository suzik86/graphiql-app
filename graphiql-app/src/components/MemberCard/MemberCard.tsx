import styles from "./MemberCard.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";
interface MemberCardProps {
  name: string;
  describtion: string;
  logo: string;
}
const MemberCard = ({ name, describtion, logo }: MemberCardProps) => {
  const t = useTranslations("HomePage");
  return (
    <div className={styles.card}>
      <Image className={styles.card__avatar} src={logo} alt="logo" />
      <p className={styles.card__title}>{t(name)}</p>
      <p className={styles.card__describtion}>{t(describtion)}</p>
    </div>
  );
};

export default MemberCard;
