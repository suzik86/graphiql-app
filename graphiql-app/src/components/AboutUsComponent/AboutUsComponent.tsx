
import styles from "./AboutUsComponent.module.scss"
import Avatar from "../../assets/rss-logo.svg"
import { members } from "./consts";
import MemberCard from "../MemberCard/MemberCard";
const AboutUsComponent = () => {
    return (
        <section className={styles.info}>
            <div className={styles.info__inner}>
                <h2 className={styles.info__title}>
                    Немного о нас
                </h2>
                <div className={styles.info__images}>
                    {members.map(item => (

                        <MemberCard
                        name={item.name}
                        describtion={item.describtion}
                        logo={Avatar}
                        />
                    ))}
               {/*
                    {
                        members.map(item => (
                            <MemberCard
                                name={item.name}
                                describtion={item.describtion}
                                logo={Avatar}
                                />
                        ))
                    }
                                */}
                </div>
            </div>
        </section>
    );
}

export default AboutUsComponent;