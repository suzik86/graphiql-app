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

