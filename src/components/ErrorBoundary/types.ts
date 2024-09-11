import { ReactNode } from "react";
export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  error: boolean;
  errorMessage: string;
}
