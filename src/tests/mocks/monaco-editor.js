const mockMonaco = {
    editor: {
      create: jest.fn(() => ({
        getAction: jest.fn(() => ({
          run: jest.fn().mockResolvedValue("formatted"),
        })),
        onDidBlurEditorWidget: jest.fn((callback) => {
          setTimeout(callback, 0); 
        }),
        getValue: jest.fn(() => '{"key": "value"}'),
        setValue: jest.fn(),
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
  
  module.exports = mockMonaco;
  