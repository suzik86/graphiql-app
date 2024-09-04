import styles from "./MemberCard.module.scss"
import Image from "next/image"
interface MemberCardProps {
    name: string,
    describtion: string,
    logo: string
}
const MemberCard = ({ name, describtion, logo }: MemberCardProps) => {
    return (
        <div className={styles.card}>
            <Image
            className={styles.card__avatar}
            src={logo} alt="logo"
             />
            <p className={styles.card__title}>
                {name}
            </p>
            <p className={styles.card__describtion}>
                {describtion}
            </p>
        </div>
    );
}

export default MemberCard;