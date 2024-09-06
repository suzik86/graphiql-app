import React from "react";
import styles from "./UrlEditor.module.scss";

interface UrlEditorProps {
  currentMethod: string;
  setMethod: React.Dispatch<React.SetStateAction<string>> | null;
  currentEndpoint: string;
  setEndpoint: React.Dispatch<React.SetStateAction<string>>;
  onSendRequest: (endpoint: string) => void;
}

const SdlEditor: React.FC<UrlEditorProps> = ({
 
  currentEndpoint,
  setEndpoint,
  onSendRequest,
}) => {
  return (
    <div className={styles.editor}>
 

      <input
        type="text"
        value={currentEndpoint}
        onChange={(e) => {
          setEndpoint(e.target.value);
        }}
        placeholder="https://api.example.com/graphql?sdl"
        className={styles.editor__input}
      />
      <button
        onClick={() => {
         onSendRequest(currentEndpoint);
        }}
        className={styles.editor__button}
      >
       Get schema
      </button>
    </div>
  );
};

export default SdlEditor;