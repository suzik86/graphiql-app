import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import { editor as monacoEditor } from "monaco-editor";

type Variable = {
  key: string;
  value: string;
  included: boolean;
};

type RequestBodyEditorProps = {
  body: object | string | null;
  setBlurredBody?: React.Dispatch<React.SetStateAction<string>>;
  variables?: Variable[];
  editorMode: "json" | "text";
  setEditorMode?: (mode: "json" | "text") => void;
  readOnly?: boolean;
};

const RequestBodyEditor: React.FC<RequestBodyEditorProps> = ({
  body,
  setBlurredBody = () => {},
  editorMode,
  setEditorMode = () => {},
  readOnly = false,
}) => {
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  // const bodyString = body === null ? '' : typeof body === 'string' ? body : JSON.stringify(body, null, 2);

  const handleEditorDidMount = (editor: monacoEditor.IStandaloneCodeEditor) => {
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
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value as "json" | "text";
    setEditorMode(newMode);
  };

  const handleBeautify = () => {
    // Using optional chaining to safely access properties if editorRef.current is not null
    const editor = editorRef.current;

    if (editor && editorMode === "json" && !readOnly) {
      // Optional chaining with non-null assertion
      editor
        .getAction("editor.action.formatDocument")
        ?.run()
        .catch((error: Error) => {
          console.error("Error formatting JSON:", error);
        });
    }
  };
  console.log("BODY!!!,", body);
  return (
    <div>
      {!readOnly && (
        <div style={{ marginBottom: "10px" }}>
          <select
            value={editorMode}
            onChange={handleModeChange}
            style={{ marginRight: "10px" }}
          >
            <option value="json">JSON</option>
            <option value="text">Text</option>
          </select>
          {editorMode === "json" && !readOnly && (
            <button onClick={handleBeautify}>Beautify</button>
          )}
        </div>
      )}
      <Editor
        height="100px"
        language={editorMode}
        value={body as string}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
          lineNumbers: "on",
          readOnly,
          formatOnType: !readOnly,
          formatOnPaste: !readOnly,
        }}
      />
    </div>
  );
};

export default RequestBodyEditor;
