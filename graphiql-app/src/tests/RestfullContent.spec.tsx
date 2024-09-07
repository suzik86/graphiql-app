import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RestClient from '../components/RestClient/RestClient';

jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({ method: 'GET', encodedUrl: [''] }),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe('RestClient Component', () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('renders RestClient component correctly', () => {
    render(<RestClient />);

    const titleElement = screen.getByText(/RESTfull Client/i);
    expect(titleElement).toBeInTheDocument();

    const urlEditorElement = screen.getByText(/Send/i);
    expect(urlEditorElement).toBeInTheDocument();

    const headerEditorElement = screen.getByText(/Headers/i);
    expect(headerEditorElement).toBeInTheDocument();
  
    const variableEditorElement = screen.getByText(/Variables \-/i);
    expect(variableEditorElement).toBeInTheDocument();
  
    const requestBodyEditorElements = screen.getAllByText(/Body/i);
    expect(requestBodyEditorElements).toHaveLength(2); 
    expect(requestBodyEditorElements[0]).toBeInTheDocument();

    const requestHandlerElement = screen.getByText(/Response/i);
    expect(requestHandlerElement).toBeInTheDocument();
  });

  test('toggles visibility of variables editor', () => {
    render(<RestClient />);

    const variablesToggle = screen.getByText(/Variables -/i);
    expect(variablesToggle).toBeInTheDocument();

    fireEvent.click(variablesToggle);

    const collapsedToggle = screen.getByText(/Variables \+/i);
    expect(collapsedToggle).toBeInTheDocument();
  });
});
