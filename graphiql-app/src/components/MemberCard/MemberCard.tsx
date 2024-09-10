import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import styles from "./MemberCard.module.scss";

interface MemberCardProps {
  name: string;
  describtion: string;
  logo: string;
  link: string;
}

const MemberCard = ({ name, describtion, logo, link }: MemberCardProps) => {
  const t = useTranslations("HomePage");
  return (
    <Link href={link} target="blank">
      <div className={styles.card}>
        <Image className={styles.card__avatar} src={logo} alt="logo" />
        <p className={styles.card__title}>{t(name)}</p>
        <p className={styles.card__describtion}>{t(describtion)}</p>
      </div>
    </Link>
  );
};

export default MemberCard;
