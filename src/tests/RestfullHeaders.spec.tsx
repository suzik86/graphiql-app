// HeaderEditor.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeaderEditor from '../components/RestClient/HeaderEditor';
import { Header, Variable } from '../components/RestClient/RestClient';
import { updateURL } from '../utils/urlUpdater';

jest.mock('../utils/urlUpdater', () => ({
  updateURL: jest.fn(),
}));

describe('HeaderEditor Component', () => {
  const mockHeaders: Header[] = [
    { key: 'Content-Type', value: 'application/json', included: true },
    { key: 'Authorization', value: 'Bearer token', included: true },
  ];

  const mockSetHeaders = jest.fn();
  const mockVariables: Variable[] = [
    { key: 'var1', value: 'value1', included: true },
  ];

  const mockMethod = 'POST';
  const mockEndpoint = '/api/test';
  const mockBody = '{"key":"value"}';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders headers correctly', () => {
    render(
      <HeaderEditor
        title="Headers"
        method={mockMethod}
        endpoint={mockEndpoint}
        body={mockBody}
        headers={mockHeaders}
        setHeaders={mockSetHeaders}
        variables={mockVariables}
      />
    );

    expect(screen.getByText('Headers')).toBeInTheDocument();

    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Authorization')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bearer token')).toBeInTheDocument();
  });

  test('adds a new header and updates URL', () => {
    render(
      <HeaderEditor
        title="Headers"
        method={mockMethod}
        endpoint={mockEndpoint}
        body={mockBody}
        headers={mockHeaders}
        setHeaders={mockSetHeaders}
        variables={mockVariables}
      />
    );

    const keyInput = screen.getByPlaceholderText('header Key');
    const valueInput = screen.getByPlaceholderText('header Value');
    const addButton = screen.getByText('Add header');

    fireEvent.change(keyInput, { target: { value: 'Accept' } });
    fireEvent.change(valueInput, { target: { value: 'application/xml' } });

    fireEvent.click(addButton);

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
    render(
      <HeaderEditor
        title="Headers"
        method={mockMethod}
        endpoint={mockEndpoint}
        body={mockBody}
        headers={mockHeaders}
        setHeaders={mockSetHeaders}
        variables={mockVariables}
      />
    );

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
    render(
      <HeaderEditor
        title="Headers"
        method={mockMethod}
        endpoint={mockEndpoint}
        body={mockBody}
        headers={mockHeaders}
        setHeaders={mockSetHeaders}
        variables={mockVariables}
      />
    );

    const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');

    fireEvent.change(keyInputs[0], { target: { value: 'Content-Type' } }); 
    fireEvent.change(valueInputs[0], { target: { value: 'application/xml' } });

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
    render(
      <HeaderEditor
        title="Headers"
        method={mockMethod}
        endpoint={mockEndpoint}
        body={mockBody}
        headers={mockHeaders}
        setHeaders={mockSetHeaders}
        variables={mockVariables}
      />
    );

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
    render(
      <HeaderEditor
        title="Headers"
        method={mockMethod}
        endpoint={mockEndpoint}
        body={mockBody}
        headers={mockHeaders}
        setHeaders={mockSetHeaders}
        variables={mockVariables}
      />
    );

    const keyInput = screen.getByPlaceholderText('header Key');
    const valueInput = screen.getByPlaceholderText('header Value');
    const addButton = screen.getByText('Add header');

    fireEvent.change(keyInput, { target: { value: '' } });
    fireEvent.change(valueInput, { target: { value: 'application/xml' } });
    fireEvent.click(addButton);

    expect(mockSetHeaders).not.toHaveBeenCalled();

    fireEvent.change(keyInput, { target: { value: 'Accept' } });
    fireEvent.change(valueInput, { target: { value: '' } });
    fireEvent.click(addButton);

    expect(mockSetHeaders).not.toHaveBeenCalled();
  });

  test('updates an existing header if key already exists', () => {
    render(
      <HeaderEditor
        title="Headers"
        method={mockMethod}
        endpoint={mockEndpoint}
        body={mockBody}
        headers={mockHeaders}
        setHeaders={mockSetHeaders}
        variables={mockVariables}
      />
    );

    const keyInput = screen.getByPlaceholderText('header Key');
    const valueInput = screen.getByPlaceholderText('header Value');
    const addButton = screen.getByText('Add header');

    fireEvent.change(keyInput, { target: { value: 'Content-Type' } });
    fireEvent.change(valueInput, { target: { value: 'text/plain' } });
    fireEvent.click(addButton);

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
