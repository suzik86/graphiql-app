import styles from "./GraphiQlSdlEditor.module.scss"
import { GraphQLSchema } from "graphql";
interface GrapgiQlTypes {
  handleChangeUrl: React.ChangeEventHandler<HTMLInputElement>;
  url: string;
  //handleSubmit: 
  btn: string,
  handleSubmit: (url: string) => Promise<GraphQLSchema>
}
const GraphiQlSdlEditor = ({ handleChangeUrl, url, btn, handleSubmit }: GrapgiQlTypes) => {
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
      <button className={styles.editor__button} //type="submit"
      onClick={()=>handleSubmit(url)}
      >
    
      {btn}
      </button>
    </div>
  );
};

export default GraphiQlSdlEditor;