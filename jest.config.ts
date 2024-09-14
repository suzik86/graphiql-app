import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "src",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
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
  //   coverageThreshold: {
  //     global: {
  //       branches: 80,
  //       functions: 60,
  //       lines: 80,
  //       statements: 80,
  //     },
  //   },

  collectCoverage: false,
  coverageReporters: ["text", "text-summary"],
  // transformIgnorePatterns: ["/node_modules/(?!(uuid)/)"],
  transformIgnorePatterns: ["/node_modules/(?!monaco-editor).+\\.js$"],
};

export default createJestConfig(config);
