"use client";
import { Component } from "react";
import { ErrorBoundaryProps, ErrorBoundaryState } from "./types";
import ErrorPageComponent from "../ErrorPageComponent/ErrorPageComponent";

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: false,
      errorMessage: "",
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error) {
    console.log("Error caught by ErrorBoundary:", error);
    this.setState({ error: true, errorMessage: error.message });
  }

  handleClose = () => {
    this.setState({ error: false, errorMessage: "" });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorPageComponent
          message={this.state.errorMessage}
          reset={this.handleClose}
        />
      );
    }

    return this.props.children;
  }
}
