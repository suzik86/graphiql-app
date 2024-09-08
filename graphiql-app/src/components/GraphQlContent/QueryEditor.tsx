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
  setEditorMode = () => {},
  schema,
  method,
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

  const handleBeautify = () => {
    try {
      if (editorRef.current && editorMode === "graphql") {
        const currentSchema = editorRef.current.getValue();
        console.log("Current schema:", currentSchema); // Debugging statement

        const ast = parse(currentSchema);
        console.log("Parsed AST:", ast); // Debugging statement

        const formatted = print(ast);
        console.log("Formatted schema:", formatted);

        setSchema(formatted);
        editorRef.current.setValue(formatted);
      }
    } catch (error) {
      setSchema("Something went wrong...");
      console.error('Error formatting code:', error);
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

useEffect(()=> {
console.log("METHOD", method)
}, [method])

  return (
    <>
      <div className={styles.body}>
        <p className={styles.body__title}>{title}</p>
        <div className={styles.body__container}>
          {!readOnly && (
            <div className={styles.body__controls}>
              {editorMode === "graphql" && (
                <span className={styles.body__beautify} onClick={handleBeautify}>
                  Beautify
                </span>
              )}
            </div>
          )}
          <Editor
            height={editorHeight}
            language={editorMode}
            value={schema }
          // value={body as string || method}
            theme="myCustomTheme"
         //   defaultValue="test"
      //   defaultValue={method}
            loading="Loading..."
         //   defaultValue={defaultValue} // Use the dynamic defaultValue here
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
  setBlurredBody?: React.Dispatch<React.SetStateAction<object | string | null>>;
  setSchema?: React.Dispatch<React.SetStateAction<string>>;
  variables?: Variable[];
  editorMode: "json" | "text" | "graphql";
  setEditorMode?: (mode: "json" | "text") => void;
  readOnly?: boolean;
  schema: string;
  method: string;
};

const QueryEditor: React.FC<RequestBodyEditorProps> = ({
  title,
  body,
  setBlurredBody = () => {},
  setSchema = () => {},
  readOnly = false,
  editorMode,
  setEditorMode = () => {},
  schema,
  method,
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


const handleBeautify = () => {
  try {
    if (editorRef.current) {
      const currentSchema = editorRef.current.getValue();   
      const ast = parse(currentSchema);   
      const formatted = print(ast);   
      setSchema(formatted)
   //   handleChangeSchema(formatted);  
      editorRef.current.setValue(formatted);  
    }
  } catch (error) {
    setSchema("Something went wrong...")
    console.error('Error formatting code:', error);
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
                <span className={styles.body__beautify} onClick={handleBeautify}>
                  Beautify
                </span>
              )}
            </div>
          )}
          <Editor
            height={editorHeight}
            language={editorMode}
            value={schema}
            theme="myCustomTheme"
            loading="Loading..."
            defaultValue={`${method} {\n\n}`}
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
 
 */
 /*
import React, { useRef, useState, useEffect } from "react";
import { Editor, type Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
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
  setBlurredBody?: React.Dispatch<React.SetStateAction<object | string | null>>;
  setSchema?: React.Dispatch<React.SetStateAction<string>>;
  variables?: Variable[];
  editorMode: "json" | "text" | "graphql";
  setEditorMode?: (mode: "json" | "text") => void;
  readOnly?: boolean;
  schema: string,
  method: string
};


const QueryEditor: React.FC<RequestBodyEditorProps> = ({
  title,
  body,
  setBlurredBody = () => { },
  setSchema = () => { },
  readOnly = false,
  editorMode,
  setEditorMode = () => { }, schema,
  method
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorHeight, setEditorHeight] = useState<number>(200);
  const maxHeight = 500;

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(body as string);
    }
  }, [body]);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
  ) => {
    editorRef.current = editor;
 
    editor.onDidChangeModelContent(() => {
      const content = editorRef.current?.getValue() || "";
      console.log("Editor content:", content);
      setSchema(content)
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

 
 
  const handleBeautify = () => {
    const editor = editorRef.current;
    if (editor && editorMode === "graphql") {
      const formatAction = editor.getAction("editor.action.formatDocument");
      if (formatAction) {
        formatAction
          .run()
          .catch((error: Error) => {
            console.error("Error formatting document:", error);
          });
      } else {
        console.warn("Format action is not available for the current editor instance.");
      }
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
      setSchema(value)
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
                <span className={styles.body__beautify} onClick={handleBeautify}>
                  Beautify
                </span>
              )}
            </div>
          )}
          <Editor
       
            height={editorHeight}
            language={editorMode}
            value={schema}
            theme="myCustomTheme"
            loading="Loading..."
            defaultValue={`${method} {\n\n}`}
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

 */