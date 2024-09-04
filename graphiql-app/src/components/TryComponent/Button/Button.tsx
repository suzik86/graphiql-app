import styles from "./Button.module.scss"
interface ButtonProps {
    color: string,
    text: string,
    left: string | null,
    right: string | null,
    top: string | null,
    bottom: string | null,
    rotate: string | null

}
const Button = ({ color, text, top, bottom, left, right, rotate }: ButtonProps) => {
    return <button className={styles.btn} style={{ backgroundColor: color }}>{text}</button>;
}

export default Button;