import React, { useState } from "react";
import styles from "./KeyValueEditor.module.scss";

type Item = {
  key: string;
  value: string;
  included: boolean;
};

type KeyValueEditorProps = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  itemType: "variable" | "header"; // or you can use string enum
  urlEncode?: boolean;
};

export default function KeyValueEditor({
  items,
  setItems,
  itemType,
  urlEncode = false,
}: KeyValueEditorProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const handleAddItem = () => {
    if (key && value) {
      const formattedValue = urlEncode ? encodeURIComponent(value) : value;
      setItems([...items, { key, value: formattedValue, included: true }]);
      setKey("");
      setValue("");
    }
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const toggleItemInclusion = (index: number) => {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, included: !item.included } : item
      )
    );
  };

  const handleEditItem = (index: number, key: string, value: string) => {
    const formattedValue = urlEncode ? encodeURIComponent(value) : value;
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, key, value: formattedValue } : item
      )
    );
  };

  return (
    <div className={styles.keyValueEditor}>
      <div className={styles.keyValueEditor__form}>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={`${itemType} Key`}
          className={styles.keyValueEditor__input}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`${itemType} Value`}
          className={styles.keyValueEditor__input}
        />
        <button onClick={handleAddItem} className={styles.keyValueEditor__button}>
          Add {itemType}
        </button>
      </div>
      <ul className={styles.keyValueEditor__list}>
        {items.map((item, index) => (
          <li key={index} className={styles.keyValueEditor__listItem}>
            <input
              type="checkbox"
              checked={item.included}
              onChange={() => toggleItemInclusion(index)}
            />
            <input
              type="text"
              value={item.key}
              onChange={(e) =>
                handleEditItem(index, e.target.value, item.value)
              }
              placeholder="Key"
              className={styles.keyValueEditor__input}
            />
            <input
              type="text"
              value={item.value}
              onChange={(e) =>
                handleEditItem(index, item.key, e.target.value)
              }
              placeholder="Value"
              className={styles.keyValueEditor__input}
            />
            <button
              onClick={() => handleDeleteItem(index)}
              className={styles.keyValueEditor__deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
