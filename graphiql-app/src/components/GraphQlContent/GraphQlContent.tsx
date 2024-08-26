import BodyCodePlayground from "../BodyCodePlayGround/BodyCodePlayground";
import GraphiQlUrlEditor from "../GraphiQlUrlEditor/GraphiQlUrlEditor";
import HeadersPlayground from "../HeadersPlayground/HeadersPlayground";
import styles from "./GraphQlContent.module.scss"
const GrafQlContent = () => {
    return (<>
        <section className={styles.content}>
            <div className={styles.content__inner}>

                <h1 className={styles.content__title}>
                    GraphiQl Client
                </h1>
                <GraphiQlUrlEditor />
                <div className={styles.content__background} />
                <div className={styles.content__field}>
                    <p className={styles.content__field__title}>
                    </p>
                </div>
                <HeadersPlayground title={"Headers"} />
                <BodyCodePlayground title={"Query"} />
                <BodyCodePlayground title={"Variables"} />
                <div className={styles.response}>
                    <p className={styles.response__title}>
                        Response
                    </p>
                    <div className={styles.response__status}>
                        <p className={styles.response__status__text}>
                            Status:
                        </p>
                        <div className={styles.response__status__code}>
                            200
                        </div>
                    </div>
                    <BodyCodePlayground title={"Body"} />
                </div>

            </div>
        </section>
    </>);
}

export default GrafQlContent;