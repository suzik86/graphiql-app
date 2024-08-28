import styles from "./GraphiqlUrleditor.module.scss";
interface GrapgiQlTypes {
  handleChangeUrl: React.ChangeEventHandler<HTMLInputElement>;
  url: string;
}
const GraphiQlUrlEditor = ({ handleChangeUrl, url }: GrapgiQlTypes) => {
  return (
    <div className={styles.editor}>
      <input
        type="text"
        onChange={handleChangeUrl}
        placeholder="Enter url..."
        value={url}
        className={styles.editor__input}
        required
      />
      <button className={styles.editor__button} type="submit">
        Send
      </button>
    </div>
  );
};

export default GraphiQlUrlEditor;
