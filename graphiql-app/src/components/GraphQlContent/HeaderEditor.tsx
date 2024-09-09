import React, { useCallback } from "react";
import styles from "./HeaderEditor.module.scss";
import KeyValueEditor from "./KeyValueEditor";
import { useTranslations } from "next-intl";
import { Header, Variable } from "./GraphQlContent";
import { updateURL } from "../../utils/urlUpdater";
//import Header
type HeaderEditorProps = {
  title: string;
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
  const t = useTranslations("GraphQl");
  return (
    <div className={styles.headers}>
      <p className={styles.headers__title}>{t("headers")}</p>
      <KeyValueEditor
        items={headers}
        setItems={setHeaders}
        itemType="header"
        onUpdateURL={handleUpdateURL}
      />
    </div>
  );
}
