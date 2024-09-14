import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeaderEditor from '../components/RestClient/HeaderEditor';
import { Header, Variable } from '../components/RestClient/RestClient';
import { updateURL } from '../utils/urlUpdater';
import { NextIntlClientProvider } from 'next-intl';

jest.mock('../utils/urlUpdater', () => ({
  updateURL: jest.fn(),
}));

  
const mockSetHeaders = jest.fn();
const mockHeaders: Header[] = [
  { key: 'Content-Type', value: 'application/json', included: true },
  { key: 'Authorization', value: 'Bearer token', included: true },
];

const mockVariables: Variable[] = [
  { key: 'var1', value: 'value1', included: true },
];

const messages = {
  Rest: {
    title: "RESTfull Client",
    send: "Send",
    Headers: "Headers",
    variables: "Variables",
    editor: "Body",
    response: "Response",
    status: "Status",
    Body: "Body",
    text: "Text",
    beautify: "Beautify",
    add: "Add",
    variable: "Variable",
    header: "Header",
    key: "Key",
    value: "Value",
    
  },
}

describe('HeaderEditor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

        
  afterAll(() => {
    jest.restoreAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks(); 
  });  



  const mockMethod = 'POST';
  const mockEndpoint = '/api/test';
  const mockBody = '{"key":"value"}'; 
  const setup = (props = {}) => {
    const defaultProps = {
      title: "Headers",
      method: mockMethod,
      endpoint: mockEndpoint,
      body: mockBody,
      headers: mockHeaders,
      setHeaders: mockSetHeaders,
      variables: mockVariables,
    };
  
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HeaderEditor {...defaultProps} {...props} />
      </NextIntlClientProvider>
    );
  };
  

  test('adds a new header and updates URL', async () => {
     act(() => {
      setup();
    })
    
        const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');

    fireEvent.change(keyInputs[0], { target: { value: 'Accept' } }); 
    fireEvent.change(valueInputs[0], { target: { value: 'application/xml' } });
    fireEvent.click(screen.getByText('Add Header'));

     expect(mockSetHeaders).toHaveBeenCalledTimes(1);

     expect(mockSetHeaders).toHaveBeenCalledWith([
      ...mockHeaders,
      { key: 'Accept', value: 'application/xml', included: true },
    ]);

    expect(updateURL).toHaveBeenCalledWith(
      mockMethod,
      mockEndpoint,
      mockBody,
      [
        ...mockHeaders,
        { key: 'Accept', value: 'application/xml', included: true },
      ],
      mockVariables
    );
  });

  test('deletes a header and updates URL', () => {
    act(() => {
      setup();
    })

    const deleteButtons = screen.getAllByText('Delete');

    fireEvent.click(deleteButtons[0]);

    expect(mockSetHeaders).toHaveBeenCalledWith([mockHeaders[1]]);

    expect(updateURL).toHaveBeenCalledWith(
      mockMethod,
      mockEndpoint,
      mockBody,
      [mockHeaders[1]],
      mockVariables
    );
  });

  test('edits a header and updates URL', () => {

      act(() => {
        setup();
      })

    const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');

    fireEvent.change(keyInputs[1], { target: { value: 'Content-Type' } }); 
    fireEvent.change(valueInputs[1], { target: { value: 'application/xml' } });

    expect(mockSetHeaders).toHaveBeenCalledWith([
      { key: 'Content-Type', value: 'application/xml', included: true },
      mockHeaders[1],
    ]);

    expect(updateURL).toHaveBeenCalledWith(
      mockMethod,
      mockEndpoint,
      mockBody,
      [
        { key: 'Content-Type', value: 'application/xml', included: true },
        mockHeaders[1],
      ],
      mockVariables
    );
  });

  test('toggles inclusion of a header and updates URL', () => {
    act(() => {
      setup();
    })


    const checkboxes = screen.getAllByRole('checkbox');

    fireEvent.click(checkboxes[0]);

    const updatedHeaders: Header[] = [
      { ...mockHeaders[0], included: false },
      mockHeaders[1],
    ];

    expect(mockSetHeaders).toHaveBeenCalledWith(updatedHeaders);

    expect(updateURL).toHaveBeenCalledWith(
      mockMethod,
      mockEndpoint,
      mockBody,
      updatedHeaders,
      mockVariables
    );
  });

  test('does not add a header if key or value is empty', () => {
    act(() => {
      setup();
    })
    const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');

    fireEvent.change(keyInputs[0], { target: { value: '' } });
    fireEvent.change(valueInputs[0], { target: { value: 'application/xml' } });
    fireEvent.click(screen.getByText('Add Header'));

    expect(mockSetHeaders).not.toHaveBeenCalled();

    fireEvent.change(keyInputs[0], { target: { value: 'Accept' } });
    fireEvent.change(valueInputs[0], { target: { value: '' } });
    fireEvent.click(screen.getByText('Add Header'));

    expect(mockSetHeaders).not.toHaveBeenCalled();
  });

  test('updates an existing header if key already exists', () => {
    act(() => {
      setup();
    })
    const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');

    fireEvent.change(keyInputs[0], { target: { value: 'Content-Type' } });
    fireEvent.change(valueInputs[0], { target: { value: 'text/plain' } });
    fireEvent.click(screen.getByText('Add Header'));

    expect(mockSetHeaders).toHaveBeenCalledWith([
      { key: 'Content-Type', value: 'text/plain', included: true },
      mockHeaders[1],
    ]);

    expect(updateURL).toHaveBeenCalledWith(
      mockMethod,
      mockEndpoint,
      mockBody,
      [
        { key: 'Content-Type', value: 'text/plain', included: true },
        mockHeaders[1],
      ],
      mockVariables
    );
  });
});
