import React from "react";

import styles from "./HeaderEditor.module.scss";
import KeyValueEditor from "../KeyValueEditor/KeyValueEditor";

type Header = {
  key: string;
  value: string;
  included: boolean;
};

type HeaderEditorProps = {
  headers: Header[];
  setHeaders: React.Dispatch<React.SetStateAction<Header[]>>;
};

export default function HeaderEditor({ headers, setHeaders }: HeaderEditorProps) {
  return (
    <div className={styles.headerEditor}>
      <h2 className={styles.headerEditor__title}>Headers Editor</h2>
      <KeyValueEditor
        items={headers}
        setItems={setHeaders}
        itemType="header"
        urlEncode={true} // URL encode the header values
      />
    </div>
  );
}
