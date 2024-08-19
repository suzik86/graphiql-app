import Link from "next/link";
import styles from "./WelcomeButton.module.scss"
interface WelcomeButtonProps {
    to: string,
    text: string
}
const WelcomeButton = ({to, text}: WelcomeButtonProps) => {
    return (
        <Link className={styles.btn} href={to}>
            {text}
        </Link>
    );
}

export default WelcomeButton;