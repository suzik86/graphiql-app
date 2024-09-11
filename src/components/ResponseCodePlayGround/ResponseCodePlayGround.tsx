import React from "react";
import styles from "./ResponseCodePlayGround.module.scss";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

interface BodyCodePlaygroundProps {
  title: string;
  response: string;
}

const ResponseCodePlayground = ({
  title,
  response,
}: BodyCodePlaygroundProps) => {
  const editorStyle = {
    width: "100%",
    height: "100%",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "22px",
  };

  let formattedResponse;
  try {
    const parsedResponse = JSON.parse(response);
    formattedResponse = JSON.stringify(parsedResponse, null, 2);
  } catch (error) {
    console.log(error);
    formattedResponse = response;
  }

  return (
    <div className={styles.code}>
      <p className={styles.code__title}>{title}</p>
      <div style={editorStyle}>
        <CodeMirror
          value={formattedResponse}
          extensions={[javascript(), oneDark]}
          theme={oneDark}
          style={{
            border: "1px solid #444",
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );
};

export default ResponseCodePlayground;

/*
import React, { useState } from 'react';
import styles from "./ResponseCodePlayGround.module.scss"
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { ViewUpdate } from '@uiw/react-codemirror';
interface BodyCodePlaygroundProps {
    title: string,
    response: string

}
const ResponseCodePlayground = ({ title, response }: BodyCodePlaygroundProps) => {



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
                    value={response}
                    extensions={[javascript(), oneDark]}

                    theme={oneDark}
                    style={{
                        border: '1px solid #444', borderRadius: '4px'
                    }}
                />
            </div>
        </div>
    );
};

export default ResponseCodePlayground;
*/
