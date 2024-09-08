jest.mock('monaco-editor', () => {
  const mockMonaco = {
    editor: {
      create: jest.fn(() => ({
        getAction: jest.fn(() => ({
          run: jest.fn().mockResolvedValue('formatted'),
        })),
        onDidContentSizeChange: jest.fn(),
        onDidBlurEditorWidget: jest.fn(),
        onDidChangeModelContent: jest.fn(),
        getModel: jest.fn(() => ({
          getValue: jest.fn(() => 'mocked value'),
          setValue: jest.fn(),
          dispose: jest.fn(),
        })),
        dispose: jest.fn(),
        updateOptions: jest.fn(),
        layout: jest.fn(),
        focus: jest.fn(),
        getOptions: jest.fn(() => ({
          readOnly: false,
        })),
      })),
      setTheme: jest.fn(),
      defineTheme: jest.fn(),
      dispose: jest.fn(),
    },
    languages: {
      register: jest.fn(),
      registerCompletionItemProvider: jest.fn(),
      registerDocumentFormattingEditProvider: jest.fn(),
      setMonarchTokensProvider: jest.fn(),
      setLanguageConfiguration: jest.fn(),
      typescript: {
        typescriptDefaults: {
          setCompilerOptions: jest.fn(),
        },
      },
    },
    Uri: {
      parse: jest.fn(),
      file: jest.fn(),
    },
  };

  return mockMonaco;
});


// to use this mock in your test file, add the following line at the top of the file
// import '@monaco-editor/react';
