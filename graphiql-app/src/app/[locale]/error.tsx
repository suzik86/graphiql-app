"use client";
import React from "react";
import ErrorPageComponent from "../../components/ErrorPageComponent/ErrorPageComponent";

interface ErrorProps {
  error: Error;
  reset: () => void;
}
const ErrorComponent: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div>
      <ErrorPageComponent message={String(error.message)} reset={reset} />
    </div>
  );
};

export default ErrorComponent;