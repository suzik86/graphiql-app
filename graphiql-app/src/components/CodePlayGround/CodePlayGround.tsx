import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

const CodeEditor = () => {
  const [code, setCode] = useState('// Напишите ваш код здесь...');

  // Define the editor style
  const editorStyle = {
    width: '100%',
    height: '100%',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  return (
    <div style={editorStyle}>
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
    </div>
  );
};

export default CodeEditor;



/*import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
 
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
*/