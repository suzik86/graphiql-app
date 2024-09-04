import Button from "./Button/Button";
import NavigateButton from "./NavigateButton/NavigateButton";
import styles from "./TryComponent.module.scss"
const TryComponent = () => {
    return (
        <section className={styles.try}>
            <div className={styles.try__inner}>
                <NavigateButton />
            </div>

            <Button text={"POST"} color={"#49CC90"} top={"50px"}
                left={"0px"}
                right={null}
                bottom={null}
                rotate={-13}

            />
            <Button text={"DELETE"} color={"#F93E3E"} top={"150px"}
                left={null}
                right={"0"}
                bottom={null}
                rotate={13}

            />
            <Button text={"PUT"} color={"#FCA130"} top={null}
                left={"0"}
                right={null}
                bottom={"150px"}
                rotate={13}

            />
            <Button text={"GET"} color={"#61AFFE"} top={null}
                left={null}
                right={"0"}
                bottom={"75px"}
                rotate={-13}

            />
        </section>
    );
}

export default TryComponent;