import React, { useState } from "react";

import styles from "./VariablesEditor.module.scss";
import KeyValueEditor from "../KeyValueEditor/KeyValueEditor";

type Variable = {
  key: string;
  value: string;
  included: boolean;
};

export default function VariablesEditor() {
  const [variables, setVariables] = useState<Variable[]>([]);

  return (
    <div className={styles.variablesEditor}>
      <h2 className={styles.variablesEditor__title}>Variables Editor</h2>
      <KeyValueEditor
        items={variables}
        setItems={setVariables}
        itemType="variable"
        urlEncode={false}
      />
    </div>
  );
}
