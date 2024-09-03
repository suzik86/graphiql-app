import React, { useCallback } from "react";
import styles from "./HeaderEditor.module.scss";
import KeyValueEditor from "../KeyValueEditor/KeyValueEditor";
import { Header, Variable } from "../RestClient/RestClient";
import { updateURL } from "../../utils/urlUpdater";

type HeaderEditorProps = {
  method: string;
  endpoint: string;
  body: object | string | null;
  headers: Header[];
  variables: Variable[];
  setHeaders: React.Dispatch<React.SetStateAction<Header[]>>;
};

export default function HeaderEditor({
  method,
  endpoint,
  body,
  headers,
  variables,
  setHeaders,
}: HeaderEditorProps) {
  const handleUpdateURL = useCallback(
    (updatedHeaders: Header[]) => {
      updateURL(method, endpoint, body, updatedHeaders, variables);
    },
    [method, endpoint, body, variables],
  );

  return (
    <div className={styles.headerEditor}>
      <h2 className={styles.headerEditor__title}>Headers Editor</h2>
      <KeyValueEditor
        items={headers}
        setItems={setHeaders}
        itemType="header"
        onUpdateURL={handleUpdateURL}
      />
    </div>
  );
}
