import React, { useEffect, useState } from 'react';
import { Editor, type Monaco } from '@monaco-editor/react';

const CodeEditorForm: React.FC = () => {
  const [code, setCode] = useState<string>('');

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };
useEffect(()=> {
    console.log("code", code)
}, [code])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted code:', code);
    // Здесь вы можете добавить логику для обработки отправки кода
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ height: '400px', border: '1px solid #ccc' }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Напишите ваш код здесь"
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CodeEditorForm;
