 
import React, { useState } from 'react';
import styles from "./BodyCodePlayground.module.scss"
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { ViewUpdate } from '@uiw/react-codemirror';
interface BodyCodePlaygroundProps {
    title: string,
    handleChangeField: ((value: string, viewUpdate: ViewUpdate) => void) | undefined
    
    
}
const BodyCodePlayground = ({title, handleChangeField}: BodyCodePlaygroundProps) => {
   

 
  const editorStyle = {
    width: '100%',
    height: '100%',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '22px',
 
  };
  const [code, setCode] = useState<string>('{}');

 
  return (
    <div className={styles.code}>

        <p className={styles.code__title}>
            {title}
        </p>
    <div style={editorStyle}>
    <CodeMirror
        value={code}
        extensions={[javascript(), oneDark]} 
        onChange={handleChangeField}
      //  onChange={(value) => handleChange(value)}
        theme={oneDark}
        style={{
            border: '1px solid #444', borderRadius: '4px' }}
      />
    </div>
    </div>
  );
};

export default BodyCodePlayground;
/*
import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import styles from "./BodyCodePlayground.module.scss"
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
interface BodyCodePlaygroundProps {
    title: string
}
const BodyCodePlayground = ({title}: BodyCodePlaygroundProps) => {
  const [code, setCode] = useState('// Напишите ваш код здесь...');

 
  const editorStyle = {
    width: '100%',
    height: '100%',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '22px',
 
  };

  return (
    <div className={styles.code}>

        <p className={styles.code__title}>
            {title}
        </p>
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
    </div>
  );
};

export default BodyCodePlayground;
 */