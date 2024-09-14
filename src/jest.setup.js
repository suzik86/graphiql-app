import "jest-canvas-mock";
import fetchMock from "jest-fetch-mock";
jest.mock("firebase/app");
jest.mock("firebase/auth");
jest.mock("firebase/firestore");
fetchMock.enableMocks();
