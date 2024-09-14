import { loader } from "@monaco-editor/react";
import path from "path";
import { performance } from "perf_hooks";
import { TextDecoder } from "util";

type Scripts = Record<string, boolean>;
export type ScriptsObserver = {
  getScriptStatus: () => Record<string, boolean>;
  disconnect: () => void;
};

const originalConsole: Console = global.console;
const originalWindow: Window & typeof globalThis = global.window;
const originalDocument: Document = global.document;

const appPath = path.join(__dirname);

export function mockForMonaco({ fromLocal } = { fromLocal: false }) {
  // Resolve "TypeError: document.queryCommandSupported is not a function"
  global.document.queryCommandSupported = () => true;
  // Resolve "TypeError: window.matchMedia is not a function"
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => {
      return {
        matches: query === "(pointer: fine)" ? true : false, // Condition for DatePicker case
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    }),
  });
  // Resolve "ReferenceError: ResizeObserver is not defined"
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: class ResizeObserver {
      /* eslint-disable @typescript-eslint/no-empty-function */
      observe() {}
      unobserve() {}
      disconnect() {}
      /* eslint-disable @typescript-eslint/no-empty-function */
    },
  });
  // Resolve "ReferenceError: TextDecoder is not defined"
  Object.defineProperty(window, "TextDecoder", {
    writable: true,
    value: TextDecoder,
  });
  // Resolve "TypeError: performance.mark is not a function" and other properties of performance
  Object.defineProperty(window, "performance", {
    writable: true,
    value: performance,
  });
  global.console = {
    ...originalConsole,
    warn: () => {},
  };

  if (fromLocal) {
    loader.config({
      paths: {
        vs: uriFromPath(
          path.resolve(appPath, "node_modules/monaco-editor/min/vs")
        ),
      },
    });
  }
}

export function createScriptsObserver() {
  const scripts: Scripts = {};

  const observer = new window.MutationObserver((mutationRecords) => {
    const addedScripts = mutationRecords.filter(
      (record) =>
        Array.from(record.addedNodes.values()).filter(
          (node) => node.nodeName === "SCRIPT"
        ).length !== 0
    );
    addedScripts.map((addedScript) =>
      Array.from(addedScript.addedNodes.values()).map((node) => {
        const src = (node as Element).getAttribute("src");
        if (src) {
          scripts[src] = false;
          node.addEventListener("load", () => {
            scripts[src] = true;
          });
        }
      })
    );
  });
  observer.observe(window.document.body, { childList: true }); // loader.js
  observer.observe(window.document.head, { childList: true }); // others

  return {
    disconnect: () => {
      observer.disconnect();
    },
    getScriptStatus: () => scripts,
  };
}

export function revertMockForMonaco() {
  global.document = originalDocument;
  global.window = originalWindow;
  global.console = originalConsole;
}

function ensureFirstBackSlash(str: string) {
  return str.length > 0 && !str.startsWith("/") ? "/" + str : str;
}

function uriFromPath(_path: string) {
  const pathName = path.resolve(_path).replace(/\\/g, "/");
  return encodeURI("file://" + ensureFirstBackSlash(pathName));
}

export function getLoadedScripts(scripts: Scripts) {
  return Object.entries(scripts)
    .filter(([, loaded]) => loaded)
    .map(([src]) => src);
}
