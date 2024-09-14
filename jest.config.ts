import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "src",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  moduleNameMapper: {
    "^monaco-editor$": "<rootDir>/tests/mocks/monaco-editor.js",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/mocks/fileMock.js",
    "^@app/(.*)$": "<rootDir>/$1",
    "\\.(css)$": "identity-obj-proxy",
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },

  collectCoverage: false,
  coverageReporters: ["text", "text-summary"],
  transformIgnorePatterns: ["/node_modules/(?!monaco-editor).+\\.js$"],
};

export default createJestConfig(config);
