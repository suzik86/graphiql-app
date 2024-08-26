import CodeEditor from "../CodePlayGround/CodePlayGround";
import HeadersPlayground from "../HeadersPlayground/HeadersPlayground";
import styles from "./GraphQlContent.module.scss"
const GrafQlContent = () => {
    return (<>
        <section className={styles.content}>
            <div className={styles.content__inner}>

                <h1 className={styles.content__title}>
                    GraphiQl Client
                </h1>
                <div className={styles.content__background} />
                <HeadersPlayground />
                <CodeEditor />
            </div>
        </section>
    </>);
}

export default GrafQlContent;