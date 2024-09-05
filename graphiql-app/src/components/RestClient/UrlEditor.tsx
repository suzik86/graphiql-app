import React from "react";
import styles from "./UrlEditor.module.scss";

interface UrlEditorProps {
  currentMethod: string;
  setMethod: React.Dispatch<React.SetStateAction<string>>;
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
  return (
    <div className={styles.editor}>
      <select
        value={currentMethod}
        onChange={(e) => {
          setMethod(e.target.value);
        }}
        className={styles.editor__select}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <input
        type="text"
        value={currentEndpoint}
        onChange={(e) => {
          setEndpoint(e.target.value);
        }}
        placeholder="https://api.example.com/resource"
        className={styles.editor__input}
      />
      <button
        onClick={() => {
          onSendRequest();
        }}
        className={styles.editor__button}
      >
        Send
      </button>
    </div>
  );
};

export default UrlEditor;
