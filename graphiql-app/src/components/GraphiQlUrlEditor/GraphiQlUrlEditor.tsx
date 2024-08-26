import styles from "./GraphiqlUrleditor.module.scss"
interface GrapgiQlTypes {
    handleChangeUrl: React.ChangeEventHandler<HTMLInputElement>
   //  handleChangeUrl: void
   // handleChangeUrl: () => void
}
const GraphiQlUrlEditor = ({ handleChangeUrl }: GrapgiQlTypes) => {
    return (
        <div className={styles.editor}>
            <input type="text"
            onChange={handleChangeUrl}
                placeholder="Enter url..."
                className={styles.editor__input}
                required
            />
            <button className={styles.editor__button}
            type="submit"
            >
                Send
            </button>
        </div>
    );
}

export default GraphiQlUrlEditor;
//Type 'void' is not assignable to type 'ChangeEventHandler<HTMLInputElement> | undefined'.