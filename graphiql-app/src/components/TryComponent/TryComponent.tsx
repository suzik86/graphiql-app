import Button from "./Button/Button";
import NavigateButton from "./NavigateButton/NavigateButton";
import styles from "./TryComponent.module.scss"
const TryComponent = () => {
    return (
        <section className={styles.try}>
            <div className={styles.try__inner}>
                <NavigateButton />
            </div>
            {/*
            <Button text={"POST"} color={"#49CC90"} top={} 
            />
            */}
        </section>
    );
}

export default TryComponent;