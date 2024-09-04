import Link from "next/link";
import styles from "./NavigateButton.module.scss"
const NavigateButton = () => {
    return (
        <Link href={"/"} className={styles.btn}>
            <p className={styles.btn__inner}>

            Попробовать
            </p>
        </Link>
    )
}
export default NavigateButton;
