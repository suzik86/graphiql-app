import styles from "./Button.module.scss";

interface ButtonProps {
    color: string;
    text: string;
    left: string | null;
    right: string | null;
    top: string | null;
    bottom: string | null;
    rotate: number;
}

const Button = ({ color, text, top, bottom, left, right, rotate }: ButtonProps) => {
    return (
        <button
            className={styles.btn}
            style={{
                backgroundColor: color,
                ...(top !== null && { top: top }),
                ...(bottom !== null && { bottom: bottom }),
                ...(left !== null && { left: left }),
                ...(right !== null && { right: right }),
                transform: `rotate(${rotate}deg)`,
            }}
        >
            {text}
        </button>
    );
}

export default Button;
 