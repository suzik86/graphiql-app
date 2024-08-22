 
import WelcomeButton from "../WelcomeButton/WelcomeButton";
import styles from "./WelcomeBackSection.module.scss"
import { btns } from "./consts"
const WelcomeBackSection = () => {
    return (
        <section className={styles.welcome}>
            <div className={styles.welcome__inner}>
                <h1 className={styles.welcome__title}>Welcome back <br />
                    (username)!</h1>
                <h2 className={styles.welcome__subtitle}>
                    Where are we going?
                </h2>
             
                <ul className={styles.welcome__btns}>
                    {btns.map(item => (
                        <li>
                            <WelcomeButton to={item.link} text={item.text} />

                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default WelcomeBackSection;