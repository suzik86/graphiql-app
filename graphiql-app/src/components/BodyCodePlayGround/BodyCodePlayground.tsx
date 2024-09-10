import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import styles from "./BodyCodePlayground.module.scss";

interface BodyCodePlaygroundProps {
  title: string;
  handleChangeField:
    | ((value: string, viewUpdate: ViewUpdate) => void)
    | undefined;
  code: string;
}

const BodyCodePlayground = ({
  title,
  handleChangeField,
  code,
}: BodyCodePlaygroundProps) => {
  const editorStyle = {
    width: "100%",
    height: "100%",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "22px",
  };

  return (
    <div className={styles.code}>
      <p className={styles.code__title}>{title}</p>
      <div style={editorStyle}>
        <CodeMirror
          value={code}
          extensions={[javascript(), oneDark]}
          onChange={handleChangeField}
          theme={oneDark}
          style={{
            border: "1px solid #444",
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );
};

export default BodyCodePlayground;
