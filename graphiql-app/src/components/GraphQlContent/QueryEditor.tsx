import React, { useRef, useState, useEffect } from "react";
import { Editor, type Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { parse, print } from 'graphql';
import styles from "./RequestBodyEditor.module.scss";

const myCustomTheme: monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "7d8799", fontStyle: "italic" },
    { token: "keyword", foreground: "c678dd" },
    { token: "identifier", foreground: "61afef" },
    { token: "string", foreground: "98c379" },
    { token: "number", foreground: "d19a66" },
    { token: "type", foreground: "e5c07b" },
    { token: "function", foreground: "61afef" },
    { token: "operator", foreground: "56b6c2" },
    { token: "variable", foreground: "e06c75" },
    { token: "invalid", foreground: "ffffff", background: "e06c75" },
  ],
  colors: {
    "editor.foreground": "#abb2bf",
    "editor.background": "#6699ff0b",
    "editorCursor.foreground": "#528bff",
    "editorLineNumber.foreground": "#7d8799",
    "editor.inactiveSelectionBackground": "#3E4451",
    "editor.selectionHighlightBackground": "#aafe661a",
    "editor.findMatchHighlightBackground": "#72a1ff59",
    "editor.findMatchBackground": "#6199ff2f",
  },
};

type Variable = {
  key: string;
  value: string;
  included: boolean;
};

type RequestBodyEditorProps = {
  title: string;
  body: object | string | null;
  setBlurredBody?: React.Dispatch<React.SetStateAction<object | string>>;
  setSchema?: React.Dispatch<React.SetStateAction<string>>;
  variables?: Variable[];
  editorMode: "json" | "text" | "graphql";
  setEditorMode?: (mode: "json" | "text") => void;
  readOnly?: boolean;
  schema: string;
  method:string
};

const QueryEditor: React.FC<RequestBodyEditorProps> = ({
  title,
  body,
  setBlurredBody = () => {},
  setSchema = () => {},
  readOnly = false,
  editorMode,
 
  schema,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorHeight, setEditorHeight] = useState<number>(200);
  const maxHeight = 500;

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(body as string);
    }
  }, [body]);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const content = editorRef.current?.getValue() || "";
      console.log("Editor content:", content);
      setSchema(content);
    });

    editor.onDidBlurEditorWidget(() => {
      const latestBody = editorRef.current?.getValue() || "";
      setBlurredBody(latestBody);
    });

    editor.onDidContentSizeChange(() => {
      const contentHeight = editor.getContentHeight();
      const newHeight = Math.min(Math.max(contentHeight, 200), maxHeight);
      setEditorHeight(newHeight);
    });
  };

  const handleFormat = () => {
    try {
      const parsedQuery = parse(schema);
      const printedQuery = print(parsedQuery);
      setSchema(printedQuery)
   //   setFormattedQuery(printedQuery);
    } catch (error) {
      console.error('Invalid GraphQL query:', error);
     // setFormattedQuery('Invalid GraphQL query.');
    }
  };

  const handleEditorTheme = (monaco: Monaco) => {
    monaco.editor.defineTheme("myCustomTheme", {
      ...myCustomTheme,
    });
    monaco.editor.setTheme("myCustomTheme");
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      tsx: "react",
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setSchema(value);
    }
  };

 
  return (
    <>
      <div className={styles.body}>
        <p className={styles.body__title}>{title}</p>
        <div className={styles.body__container}>
          {!readOnly && (
            <div className={styles.body__controls}>
              {editorMode === "graphql" && (
                <span className={styles.body__beautify} onClick={handleFormat}>
                  Beautify
                </span>
              )}
            </div>
          )}
          <Editor
            height={editorHeight}
            language={editorMode}
            value={schema }
       
            theme="myCustomTheme"
       
            loading="Loading..."
        
            beforeMount={handleEditorTheme}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default QueryEditor;

 /*
 import React, { useState } from 'react';
import { parse, print } from 'graphql';

const GraphQLFormatter: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [formattedQuery, setFormattedQuery] = useState<string>('');

  const handleFormat = () => {
    try {
      const parsedQuery = parse(query);
      const printedQuery = print(parsedQuery);
      setFormattedQuery(printedQuery);
    } catch (error) {
      console.error('Invalid GraphQL query:', error);
      setFormattedQuery('Invalid GraphQL query.');
    }
  };

  return (
    <div>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your GraphQL query here..."
        rows={10}
        cols={50}
      />
      <br />
      <button onClick={handleFormat}>Format Query</button>
      <br />
      <textarea
        value={formattedQuery}
        readOnly
        placeholder="Formatted query will appear here..."
        rows={10}
        cols={50}
      />
    </div>
  );
};

export default GraphQLFormatter;

*/