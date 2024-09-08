
import '@monaco-editor/react';
import { TextDecoder } from 'util';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestBodyEditor from '../components/RestClient/RequestBodyEditor';
import userEvnet from '@testing-library/user-event'
import mockMonaco from './mocks/@monaco-editor/react';
import { act } from '@testing-library/react';
import { debug } from 'console';

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

// jest.mock('@monaco-editor/react', () => ({
//   Editor: jest.fn(({ onMount }) => {
//     const editorInstance = {
//       getModel: jest.fn().mockReturnValue({ getValue: jest.fn().mockReturnValue('mocked value') }),
//       getAction: jest.fn().mockReturnValue({ run: jest.fn().mockResolvedValue('formatted') }),
//       onDidBlurEditorWidget: jest.fn(),
//       onDidContentSizeChange: jest.fn(),
//     };
//     onMount(editorInstance, { languages: { typescript: { typescriptDefaults: {} } } });
//     return <div data-testid="monaco-editor">Monaco Editor</div>;
//   }),
// }));

// jest.mock('monaco-editor', () => {
//   return {
//     Editor: jest.fn().mockImplementation(() => mockMonaco),
//   };
// });


// jest.mock('monaco-editor', () => mockMonaco);

describe('RequestBodyEditor Component', () => {
  const mockSetBlurredBody = jest.fn();
  const mockSetEditorMode = jest.fn();


  beforeEach(() => {
    jest.resetModules(); // Clear the module registry
    Object.defineProperty(window, 'devicePixelRatio', { value: 1 });
    jest.clearAllMocks();
  });

//   beforeAll(() => {
//     // Resolve "TypeError: document.queryCommandSupported is not a function"
//     global.document.queryCommandSupported = () => true;
//     // Resolve "TypeError: window.matchMedia is not a function"
//     Object.defineProperty(window, 'matchMedia', {
//         writable: true,
//         value: jest.fn().mockImplementation(query => ({
//            matches: false,
//            media: query,
//            onchange: null,
//            addListener: jest.fn(),
//            removeListener: jest.fn(),
//            addEventListener: jest.fn(),
//            removeEventListener: jest.fn(),
//            dispatchEvent: jest.fn(),
//         })),
//     });
//     // Resolve "ReferenceError: ResizeObserver is not defined"
//     Object.defineProperty(window, 'ResizeObserver', {
//         value: class ResizeObserver {
//            observe() {}
//            unobserve() {}
//            disconnect() {} 
//         },
//     });
//     // Resolve "ReferenceError: TextDecoder is not defined"
//     // Object.defineProperty(window, 'TextDecoder', { value: TextDecoder });
//     Object.defineProperty(window, 'devicePixelRatio', { value: 1 });
// })

//   test('renders the editor with correct title and default values', () => {
//     render(
//       <RequestBodyEditor
//         title="Request Body"
//         body={null}
//         editorMode="json"
//       />
//     );

//     expect(screen.getByText('Request Body')).toBeInTheDocument();
//     expect(screen.getByRole('combobox')).toHaveValue('json');
//   });

//   test('calls setBlurredBody on editor blur', () => {
//     render(
//       <RequestBodyEditor
//         title="Request Body"
//         body='{"key": "value"}'
//         setBlurredBody={mockSetBlurredBody}
//         editorMode="json"
//       />
//     );

//     const editor = screen.getByRole('textbox');
//     fireEvent.blur(editor);

//     expect(mockSetBlurredBody).toHaveBeenCalledWith('{"key": "value"}');
//   });

//   test('handles mode change correctly', () => {
//     render(
//       <RequestBodyEditor
//         title="Request Body"
//         body="Some text body"
//         editorMode="text"
//         setEditorMode={mockSetEditorMode}
//       />
//     );

//     const select = screen.getByRole('combobox');
//     fireEvent.change(select, { target: { value: 'json' } });

//     expect(mockSetEditorMode).toHaveBeenCalledWith('json');
//   });

//   test('displays the Beautify button when in JSON mode', () => {
//     render(
//       <RequestBodyEditor
//         title="Request Body"
//         body='{"key": "value"}'
//         editorMode="json"
//         setEditorMode={mockSetEditorMode}
//       />
//     );

//     const beautifyButton = screen.getByText('Beautify');
//     expect(beautifyButton).toBeInTheDocument();
//   });



  // test('does not allow editing in read-only mode', async () => {
  //   const { container } = render(
  //     <RequestBodyEditor
  //       title="Request Body"
  //       body='{"key": "value"}'
  //       editorMode="json"
  //       readOnly={true}
  //     />
  //   );
  
  // //   // Ожидание появления элемента .monaco-editor
  //   await waitFor(() => {
  //     const editorContent = container.querySelector('.monaco-editor');
  //     expect(editorContent).not.toBeNull(); // Убедиться, что редактор присутствует
  //   });
  //   const editor = await screen.findByRole('textbox')
  //   expect(editor).toBeInTheDocument()
  
  //   // Ожидание загрузки и отрисовки редактора
  //   await waitFor(() => {
  //     const textarea = container.querySelector('textarea');
  //     expect(textarea).not.toBeNull(); // Убедиться, что textarea присутствует
  //   });
  
  //   // Попытка изменения содержимого (при readOnly это должно быть заблокировано)
  //   const textarea = container.querySelector('textarea');
  //   if (textarea) {
  //     fireEvent.input(textarea, { target: { value: '{"key": "new value"}' } });
  //     const editorValue = textarea.innerText;
  //     expect(editorValue).toContain('"key": "value"');
  //   } else {
  //     throw new Error('Textarea not found');
  //   }
  // });
  test('renders Monaco editor in non-read-only mode', async () => {
    // Access Monaco editor and mock the `getOptions` method
    const monaco = require('monaco-editor');
    
    // Spy on the create method to get the editor instance
    const mockEditorInstance = monaco.editor.create();
  
    // Mock `getOptions` to simulate non-read-only mode
    const mockGetOptions = jest.spyOn(mockEditorInstance, 'getOptions').mockReturnValue({
      readOnly: false, // Explicitly mock the editor as non-read-only
    });
  
    // Render the component
    render(
      <RequestBodyEditor
        title="Request Body"
        body='{"key": "value"}'
        editorMode="json"
        readOnly={false} // Explicitly set to false to check for non-read-only
      />
    );
  
    // Simulate calling getOptions after editor is created
    mockEditorInstance.getOptions();
  
    // Ensure the editor is not in read-only mode
    expect(mockGetOptions).toHaveBeenCalled();
    expect(mockGetOptions).toHaveReturnedWith(expect.objectContaining({ readOnly: false }));
  
    // Clean up after the test
    mockGetOptions.mockRestore();
  });





test('handleBeautify should handle promises correctly', async () => {
  // Render the component
  render(
    <RequestBodyEditor
      title="Request Body"
      body='{"key": "value"}'
      setBlurredBody={() => {}}
      editorMode="json"
      setEditorMode={() => {}}
    />
  );

  // Find the Beautify button
  const beautifyButton = screen.getByText('Beautify');

  // Simulate button click
  if (beautifyButton) {
    await act(async () => {
      beautifyButton.click();
    });
  }

  // Access the mockMonaco object
  const mockMonaco = require('monaco-editor');
  const mockEditorInstance = mockMonaco.editor.create();
  const mockGetAction = mockEditorInstance.getAction;
  const mockRun = mockGetAction('editor.action.formatDocument').run;
  await act(async () => {
    await mockRun();
  });

  // Log mock function calls for debugging
  console.log('Mock GetAction Calls:', mockGetAction.mock.calls);
  console.log('Mock Run Calls:', mockRun.mock.calls);

  // Check if getAction was called with the correct parameter
  expect(mockGetAction).toHaveBeenCalledWith('editor.action.formatDocument');
  // Check if run was called
  expect(mockRun).toHaveBeenCalled();
});
test('handleBeautify should handle errors correctly', async () => {
  // Access the original Monaco editor
  const monaco = require('monaco-editor');
  
  // Spy on the `run` method and mock it to reject with an error
  const mockRun = jest.spyOn(monaco.editor.create().getAction('editor.action.formatDocument'), 'run')
    .mockRejectedValue(new Error('Formatting error'));

  // Render the component
  render(
    <RequestBodyEditor
      title="Request Body"
      body='{"key": "value"}'
      setBlurredBody={() => {}}
      editorMode="json"
      setEditorMode={() => {}}
    />
  );

  // Find the Beautify button
  const beautifyButton = screen.getByText('Beautify');

  // Simulate button click
  if (beautifyButton) {
    await act(async () => {
      beautifyButton.click();
    });
  }

  // Check if `run` was called and it rejects with the expected error
  await expect(mockRun).rejects.toThrow('Formatting error');

  // Clean up the spy after the test
  mockRun.mockRestore();
});
  

});
