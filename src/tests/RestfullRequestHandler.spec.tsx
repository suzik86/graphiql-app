/**
 * @jest-environment-options { "resources": "usable" }
 */
import { TextDecoder } from 'util';
import RequestHandler from "../components/RestClient/RequestHandler"
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from "react";
import { debug } from 'console';

jest.mock('node-fetch', () => jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    }),
  ));

// global.fetch = jest.fn(() =>
//     Promise.resolve({
//       ok: true,
//       status: 200,
//       text: () => Promise.resolve(JSON.stringify({ success: true })),
//     }),
//   );
  
  const mockHeaders = [
    { key: "Authorization", value: "Bearer token", included: true },
    { key: "Content-Type", value: "application/json", included: true },
  ];
  
  const mockVariables = [
    { key: "userId", value: "123", included: true },
  ];
  
  describe("RequestHandler", () => {
    const setup = (props = {}) => {
      const defaultProps = {
        method: "POST",
        endpoint: "/test-endpoint",
        headers: mockHeaders,
        body: { userId: "{{userId}}" },
        editorMode: "json" as "json" | "text",
        variables: mockVariables,
      };
      return render(<RequestHandler {...defaultProps} {...props} />);
    };

    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        jest.spyOn(console, "warn").mockImplementation(() => {});
    
    
        // Resolve "TypeError: document.queryCommandSupported is not a function"
        global.document.queryCommandSupported = () => true;
        // Resolve "TypeError: window.matchMedia is not a function"
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
               matches: false,
               media: query,
               onchange: null,
               addListener: jest.fn(),
               removeListener: jest.fn(),
               addEventListener: jest.fn(),
               removeEventListener: jest.fn(),
               dispatchEvent: jest.fn(),
            })),
        });
        // Resolve "ReferenceError: ResizeObserver is not defined"
        Object.defineProperty(window, 'ResizeObserver', {
            value: class ResizeObserver {
               observe() {}
               unobserve() {}
               disconnect() {} 
            },
        });
        // Resolve "ReferenceError: TextDecoder is not defined"
        Object.defineProperty(window, 'TextDecoder', { value: TextDecoder });
    })
      afterAll(() => {
        jest.restoreAllMocks();
      });

      test("renders the component with initial props", async () => {
        act(() => {
            setup();
        })
        debug();
       
        expect(screen.getByText(/Response/i)).toBeInTheDocument();
        expect(screen.getByText(/Status/i)).toBeInTheDocument();
          const editor = await screen.findByRole('textbox')
        await waitFor(() => {
            expect(editor).toBeInTheDocument()
        })
      });
    
})