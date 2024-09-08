import React from "react";
import styles from "./UrlEditor.module.scss";
import { useTranslations } from "next-intl";
interface UrlEditorProps {
  currentMethod: string;
  setMethod: React.Dispatch<React.SetStateAction<string>> | null;
  currentEndpoint: string;
  setEndpoint: React.Dispatch<React.SetStateAction<string>>;
  onSendRequest: () => void;
}

const UrlEditor: React.FC<UrlEditorProps> = ({
  currentMethod,
  setMethod,
  currentEndpoint,
  setEndpoint,
  onSendRequest,
}) => {
  const t = useTranslations("GraphQl");
  return (
    <div className={styles.editor}>
      <select
        value={currentMethod}
        onChange={(e) => {
          if (setMethod) {
            setMethod(e.target.value)
        //    setMethod(`${e.target.value} {\n\n}`);
            //`${method} {\n\n}`
          }
        }}
        className={styles.editor__select}
      >

        <option value="query">query</option>
        <option value="mutation">mutation</option>
      </select>

      <input
        type="text"
        value={currentEndpoint}
        onChange={(e) => {
          setEndpoint(e.target.value);
        }}
        placeholder="https://api.example.com/graphql"
        className={styles.editor__input}
      />
      <button
        onClick={() => {
          onSendRequest();
        }}
        className={styles.editor__button}
      >
        {t("send")}
      </button>
    </div>
  );
};

export default UrlEditor;
