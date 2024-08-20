
import Image from "next/image";
import styles from "./Github.module.scss"
import Logo from "../../assets/github.png"
import Link from "next/link";
interface GitHubProps {
    username: string
    to: string
}
const Github = ({ username, to }: GitHubProps) => {
    return (
        <div className={styles.github}>
            <Image  src={Logo} alt="logo" />
            <Link className={styles.github__text} href={to}> {username}</Link>
        </div>
    );
}

export default Github;