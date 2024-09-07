import React, { useEffect, useRef, useState } from "react";
import { Editor, type Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import prettier from "prettier/standalone";
import parserGraphql from "prettier/parser-graphql";
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
  setBlurredBody?: React.Dispatch<React.SetStateAction<string>>;
  variables?: Variable[];
  editorMode: "graphql" | "json" | "text";
  setEditorMode?: (mode: "json" | "text") => void;
  readOnly?: boolean;
  handleChangeSchema: (schema: string) => void;
  method: string;
};

const QueryEditor: React.FC<RequestBodyEditorProps> = ({
  title,
  body,
  setBlurredBody = () => {},
  editorMode,
  setEditorMode = () => {},
  readOnly = false,
  handleChangeSchema,
  method,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorHeight, setEditorHeight] = useState<number>(200);
  const [editorValue, setEditorValue] = useState(`${method} {\n\n}`);
  const maxHeight = 500;

  useEffect(() => {
    setEditorValue(`${method} {\n\n}`);
  }, [method]);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;

    if (readOnly) {
      editor.updateOptions({ readOnly: true });
    }

    editor.onDidBlurEditorWidget(() => {
      if (!readOnly) {
        const latestBody = editorRef.current?.getValue() || "";
        setBlurredBody(latestBody);
      }
    });

    editor.onDidContentSizeChange(() => {
      const contentHeight = editor.getContentHeight();
      const newHeight = Math.min(Math.max(contentHeight, 200), maxHeight);
      setEditorHeight(newHeight);
    });
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

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value as "json" | "text";
    setEditorMode(newMode);
  };

  const handleBeautify = async () => {
    const editor = editorRef.current;
    if (editor && editorMode === "graphql" && !readOnly) {
      try {
        const formatted = await prettier.format(editor.getValue() || "", {
          parser: "graphql",
          plugins: [parserGraphql],
        });
        editor.setValue(formatted);
      } catch (error) {
        console.error("Error formatting GraphQL:", error);
      }
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setEditorValue(value || "");
    handleChangeSchema(value || "");
  };

  return (
    <div className={styles.body}>
      <p className={styles.body__title}>{title}</p>
      <div className={styles.body__container}>
        {!readOnly && (
          <div className={styles.body__controls}>
            <select
              className={styles.body__select}
              value={editorMode}
              onChange={handleModeChange}
            >
              <option value="json">JSON</option>
              <option value="text">Text</option>
            </select>
            {editorMode === "graphql" && (
              <span className={styles.body__beautify} onClick={handleBeautify}>
                Beautify
              </span>
            )}
          </div>
        )}

        <Editor
          height={editorHeight}
          language="graphql"
          theme="myCustomTheme"
          loading="Loading..."
          value={editorValue}
          onMount={handleEditorDidMount}
          beforeMount={handleEditorTheme}
          options={{
            fixedOverflowWidgets: true,
            placeholder: "Enter your GraphQL query...",
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            fontFamily: "Nunito",
            readOnly,
            formatOnType: !readOnly,
            formatOnPaste: readOnly,
            fontSize: 22,
          }}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default QueryEditor;


/*
import React, { useEffect, useRef, useState } from "react";
import { Editor, type Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import prettier from "prettier/standalone";
import parserGraphql from "prettier/parser-graphql";
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
  setBlurredBody?: React.Dispatch<React.SetStateAction<string>>;
  variables?: Variable[];
  editorMode: "graphql" | "json" | "text";
  setEditorMode?: (mode: "json" | "text") => void;
  readOnly?: boolean;
  handleChangeSchema: (schema: string) => void;
  method: string
};

const QueryEditor: React.FC<RequestBodyEditorProps> = ({
  title,
  body,
  setBlurredBody = () => {},
  editorMode,
  setEditorMode = () => {},
  readOnly = false,
  handleChangeSchema,
  method
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorHeight, setEditorHeight] = useState<number>(200);
  const maxHeight = 500;

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;

    if (readOnly) {
      editor.updateOptions({ readOnly: true });
    }

    editor.onDidBlurEditorWidget(() => {
      if (!readOnly) {
        const latestBody = editorRef.current?.getValue() || "";
        setBlurredBody(latestBody);
      }
    });

    editor.onDidContentSizeChange(() => {
      const contentHeight = editor.getContentHeight();
      const newHeight = Math.min(Math.max(contentHeight, 200), maxHeight);
      setEditorHeight(newHeight);
    });
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

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value as "json" | "text";
    setEditorMode(newMode);
  };

  const handleBeautify = async () => {
    const editor = editorRef.current;
    if (editor && editorMode === "graphql" && !readOnly) {
      try {
        const formatted = await prettier.format(editor.getValue() || "", {
          parser: "graphql",
          plugins: [parserGraphql],
        });
        editor.setValue(formatted);
      } catch (error) {
        console.error("Error formatting GraphQL:", error);
      }
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    handleChangeSchema(String(value));
  };

 // const defaultValue = readOnly ? undefined : `query {\n\n}`;
// const [defaultValue, setDefaultValue] = useState(() => readOnly ? undefined : `${method} {\n\n}`);
const [defaultValue, setDefaultValue] = useState(() =>`${method} {\n\n}`);
 useEffect(()=> {
  console.log("METH", method)
setDefaultValue(method)
 }, [method])
// const defaultValue = readOnly ? undefined : `${method} {\n\n}`;
  return (
    <div className={styles.body}>
      <p className={styles.body__title}>{title}</p>
      <div className={styles.body__container}>
        {!readOnly && (
          <div className={styles.body__controls}>
            <select
              className={styles.body__select}
              value={editorMode}
              onChange={handleModeChange}
            >
              <option value="json">JSON</option>
              <option value="text">Text</option>
            </select>
            {editorMode === "graphql" && (
              <span className={styles.body__beautify} onClick={handleBeautify}>
                Beautify
              </span>
            )}
          </div>
        )}

        <Editor
          height={editorHeight}
          language="graphql"
          theme="myCustomTheme"
          loading="Loading..."
          defaultValue={defaultValue}
          value={body as string}
          onMount={handleEditorDidMount}
          beforeMount={handleEditorTheme}
          options={{
            fixedOverflowWidgets: true,
            placeholder: "Enter your GraphQL query...",
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            fontFamily: "Nunito",
            readOnly,
            formatOnType: !readOnly,
            formatOnPaste: readOnly,
            fontSize: 22,
          }}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default QueryEditor;

 */