import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RestClient from '../components/RestClient/RestClient';
import { NextIntlClientProvider } from 'next-intl';
import { updateURL } from '../utils/urlUpdater';
import { encodeBase64, decodeBase64 } from '../utils/base64';

jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({ method: 'GET', encodedUrl: [''] }),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));



// jest.mock('../utils/base64', () => ({
//   decodeBase64: jest.fn(),
//   encodeBase64: jest.fn(),
// }));

jest.mock("../utils/urlUpdater", () => ({
  updateURL: jest.fn(),
}));

const messages = {
  Rest: {
    response: 'Response',
    status: 'Status',
    Body: 'Body',
    send: 'Send Request',
  },
};

describe('RestClient Component', () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('renders RestClient component correctly', () => {

    act(() => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <RestClient />
        </NextIntlClientProvider>
      );
    });
      

    const titleElement = screen.getByText(/Rest.title/i);
    expect(titleElement).toBeInTheDocument();

    const urlEditorElement = screen.getByText(/Send/i);
    expect(urlEditorElement).toBeInTheDocument();

    const headerEditorElement = screen.getByText(/Headers/i);
    expect(headerEditorElement).toBeInTheDocument();
  
    const variableEditorElement = screen.getByText(/Variables -/i);
    expect(variableEditorElement).toBeInTheDocument();
  
    const requestBodyEditorElements = screen.getAllByText(/Body/i);
    expect(requestBodyEditorElements).toHaveLength(2); 
    expect(requestBodyEditorElements[0]).toBeInTheDocument();

    const requestHandlerElement = screen.getByText(/Response/i);
    expect(requestHandlerElement).toBeInTheDocument();
  });

  test('toggles visibility of variables editor', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <RestClient />
      </NextIntlClientProvider>
    );
  

    const variablesToggle = screen.getByText(/Variables -/i);
    expect(variablesToggle).toBeInTheDocument();

    fireEvent.click(variablesToggle);

    const collapsedToggle = screen.getByText(/Variables \+/i);
    expect(collapsedToggle).toBeInTheDocument();
  });

  test('updates URL when endpoint changes', async () => {

    await act (async() => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <RestClient />
        </NextIntlClientProvider>
      );
      })


    act(() => {
      const newEndpoint = 'https://new-api.example.com/new-resource';
      const urlInput = screen.getByPlaceholderText(/https:\/\/api.example.com\/resource/i);
      const urlEditorButton = screen.getByText(/Send Request/i);

      fireEvent.change(urlInput, {
        target: { value: newEndpoint },
      });
      fireEvent.click(urlEditorButton);
 
    });
    
    await waitFor(() => {
      expect(updateURL).toHaveBeenCalledWith(
        'GET',                            
        'https://new-api.example.com/new-resource',           
        null,                           
        [],                          
        []                                 
      );
    });
  });
 
});






