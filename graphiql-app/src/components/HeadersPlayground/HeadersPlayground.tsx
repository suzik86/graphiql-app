//С АВТОКОМПЛИТОМ
import React, { useState } from "react";
import styles from "./HeadersPlayground.module.scss";

interface Row {
  key: string;
  value: string;
}

const keySuggestions = [
  "Content-Type",
  "Authorization",
  "Accept",
  "User-Agent",
  "Cache-Control",
];

const valueSuggestions = [
  "application/json",
  "application/xml",
  "text/html",
  "Bearer token",
  "gzip",
];

interface HeadersProps {
  title: string;
  handleChangeHeaders: (headers: Row[]) => void;
  rows: Row[];
  //    handleChangeHeaders: React.ChangeEventHandler<HTMLInputElement>
}
const HeaderTable = ({ title, handleChangeHeaders, rows }: HeadersProps) => {
  //const [rows, setRows] = useState<Row[]>([{ key: '', value: '' }]);

  const handleInputChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    if (
      newRows[index].key.trim() === "" &&
      newRows[index].value.trim() === ""
    ) {
      newRows.splice(index, 1);
    }

    if (
      index === rows.length - 1 &&
      (newRows[index].key.trim() !== "" || newRows[index].value.trim() !== "")
    ) {
      newRows.push({ key: "", value: "" });
    }

    handleChangeHeaders(newRows);
  };

  return (
    <div className={styles.headers}>
      <p className={styles.headerTitle}>{title}</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerCell}>Key</th>
            <th className={styles.headerCell}>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) =>
                    handleInputChange(index, "key", e.target.value)
                  }
                  className={
                    index === rows.length - 1
                      ? `${styles.input} ${styles.placeholder}`
                      : styles.input
                  }
                  list={`key-suggestions-${index}`}
                  placeholder="Key"
                />
                <datalist id={`key-suggestions-${index}`}>
                  {keySuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
              <td>
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) =>
                    handleInputChange(index, "value", e.target.value)
                  }
                  className={
                    index === rows.length - 1
                      ? `${styles.input} ${styles.placeholder}`
                      : styles.input
                  }
                  list={`value-suggestions-${index}`}
                  placeholder="Value"
                />
                <datalist id={`value-suggestions-${index}`}>
                  {valueSuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeaderTable;

/* БЕЗ АВТОКОМПЛИТА
import React, { useState } from 'react';
import styles from './HeadersPlayground.module.scss';

interface Row {
  key: string;
  value: string;
}

const HeaderTable = () => {
  const [rows, setRows] = useState<Row[]>([{ key: '', value: '' }]);

  const handleInputChange = (index: number, field: 'key' | 'value', value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;

 
    if (newRows[index].key.trim() === '' && newRows[index].value.trim() === '') {
      newRows.splice(index, 1);
    }

  
    if (index === rows.length - 1 && (newRows[index].key.trim() !== '' || newRows[index].value.trim() !== '')) {
      newRows.push({ key: '', value: '' });
    }

    setRows(newRows);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell}>Key</th>
          <th className={styles.headerCell}>Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td>
              <input
                type="text"
                value={row.key}
                onChange={(e) => handleInputChange(index, 'key', e.target.value)}
                className={index === rows.length - 1 ? `${styles.input} ${styles.placeholder}` : styles.input}
                placeholder="Key"
              />
            </td>
            <td>
              <input
                type="text"
                value={row.value}
                onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                className={index === rows.length - 1 ? `${styles.input} ${styles.placeholder}` : styles.input}
                placeholder="Value"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HeaderTable;

*/
