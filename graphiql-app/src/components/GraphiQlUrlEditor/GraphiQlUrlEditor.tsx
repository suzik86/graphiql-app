import styles from "./GraphiqlUrleditor.module.scss"
const GraphiQlUrlEditor = () => {
    return (
        <div className={styles.editor}>
            <input type="text"
            placeholder="Enter url..."
                className={styles.editor__input}
            />
            <button className={styles.editor__button}>
                Send
            </button>
        </div>
    );
}

export default GraphiQlUrlEditor;