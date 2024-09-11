import React from "react";
import styles from "./UrlEditor.module.scss";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Rest");

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value);
    getButtonClass();
  };

  const getButtonClass = () => {
    let buttonClass = styles.editor__select;

    switch (currentMethod) {
      case "GET":
        buttonClass += ` ${styles.editor__select__get}`;
        break;
      case "POST":
        buttonClass += ` ${styles.editor__select__post}`;
        break;
      case "PUT":
        buttonClass += ` ${styles.editor__select__put}`;
        break;
      case "DELETE":
        buttonClass += ` ${styles.editor__select__delete}`;
        break;
      default:
        break;
    }
    return buttonClass;
  };

  return (
    <div className={styles.editor}>
      <select
        value={currentMethod}
        onChange={handleMethodChange}
        className={getButtonClass()}
      >
        <option value="GET" className={styles.editor__select__get}>
          GET
        </option>
        <option value="POST" className={styles.editor__select__post}>
          POST
        </option>
        <option value="PUT" className={styles.editor__select__put}>
          PUT
        </option>
        <option value="DELETE" className={styles.editor__select__delete}>
          DELETE
        </option>
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
        {t("send")}
      </button>
    </div>
  );
};

export default UrlEditor;
