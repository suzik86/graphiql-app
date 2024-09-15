import Link from "next/link";
import styles from "./HeaderButton.module.scss";

interface HeaderButtonProps {
  to: string;
  text: string;
}
const HeaderButton = ({ to, text }: HeaderButtonProps) => {
  return (
    <Link className={styles.btn} href={to}>
      {text}
    </Link>
  );
};

export default HeaderButton;
