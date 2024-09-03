import React, { useState, useEffect } from "react";
import styles from "./KeyValueEditor.module.scss";

type Item = {
  key: string;
  value: string;
  included: boolean;
};

type KeyValueEditorProps = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  itemType: "variable" | "header"; // or use string enum
  onUpdateURL?: (items: Item[]) => void; // Callback for URL update
};

export default function KeyValueEditor({
  items,
  setItems,
  itemType,
  onUpdateURL,
}: KeyValueEditorProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [modifiedIndices, setModifiedIndices] = useState<Set<number>>(
    new Set(),
  );
  const [duplicateKeys, setDuplicateKeys] = useState<Set<number>>(new Set());

  const handleAddItem = () => {
    if (key && value) {
      const existingItemIndex = items.findIndex((item) => item.key === key);
      let newItems;

      if (existingItemIndex !== -1) {
        // Key exists, update value
        newItems = items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, value } // No need for isModified here
            : item,
        );
        setModifiedIndices((prev) => new Set(prev).add(existingItemIndex));
      } else {
        // Key doesn't exist, add new item
        newItems = [...items, { key, value, included: true }];
      }

      setItems(newItems);
      setKey("");
      setValue("");
      onUpdateURL?.(newItems);
    }
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setModifiedIndices((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    setDuplicateKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    onUpdateURL?.(newItems);
  };

  const toggleItemInclusion = (index: number) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, included: !item.included } : item,
    );
    setItems(newItems);
    onUpdateURL?.(newItems);
  };

  const handleEditItem = (index: number, newKey: string, newValue: string) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, key: newKey, value: newValue } : item,
    );

    setItems(newItems);
    setModifiedIndices((prev) => new Set(prev).add(index));
    checkForDuplicates(newItems);
    onUpdateURL?.(newItems);
  };

  const checkForDuplicates = (newItems: Item[]) => {
    const keysCount: { [key: string]: number } = {};
    const duplicates = new Set<number>();

    newItems.forEach((item) => {
      if (keysCount[item.key]) {
        keysCount[item.key] += 1;
      } else {
        keysCount[item.key] = 1;
      }
    });

    newItems.forEach((item, index) => {
      if (keysCount[item.key] > 1) {
        duplicates.add(index);
      }
    });

    setDuplicateKeys(duplicates);
  };

  useEffect(() => {
    const timer = setTimeout(() => setModifiedIndices(new Set()), 1000);
    return () => clearTimeout(timer);
  }, [items]);

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
        <button
          onClick={handleAddItem}
          className={styles.keyValueEditor__button}
        >
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
              className={`${styles.keyValueEditor__input} ${
                modifiedIndices.has(index) ? styles.blinkBorder : ""
              } ${duplicateKeys.has(index) ? styles.redBorder : ""}`} // Apply red border if duplicate
            />
            <input
              type="text"
              value={item.value}
              onChange={(e) => handleEditItem(index, item.key, e.target.value)}
              placeholder="Value"
              className={`${styles.keyValueEditor__input} ${
                modifiedIndices.has(index) ? styles.blinkBorder : ""
              } ${duplicateKeys.has(index) ? styles.redBorder : ""}`} // Apply red border if duplicate
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
