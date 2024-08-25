import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

// Импортируем темы и языковые модули для CodeMirror
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

const CodeEditor = () => {
  const [code, setCode] = useState('// Напишите ваш код здесь...');

  return (
    <CodeMirror
      value={code}
      options={{
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => {
        setCode(value);
      }}
      onChange={(editor, data, value) => {
        console.log('Изменения:', value);
      }}
    />
  );
};

export default CodeEditor;
