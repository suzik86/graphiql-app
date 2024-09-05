import styles from "./GraphiqlUrleditor.module.scss";
interface GrapgiQlTypes {
  handleChangeUrl: React.ChangeEventHandler<HTMLInputElement>;
  url: string;
  
  btn: string
}
const GraphiQlUrlEditor = ({ handleChangeUrl, url, btn }: GrapgiQlTypes) => {
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
    
      {btn}
      </button>
    </div>
  );
};

export default GraphiQlUrlEditor;