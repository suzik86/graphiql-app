// RestClient.js
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./RestClient.module.scss";
import VariablesEditor from "./VariablesEditor";
import HeaderEditor from "./HeaderEditor";
import { handleRequest } from "../../utils/requestHandler";

export default function RestClient() {
  const router = useRouter();
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "", included: true }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("");
  const [isVariablesVisible, setIsVariablesVisible] = useState(false);
  const [variables, setVariables] = useState([]);

  // Function to update URL based on current state
  const updateURL = () => {
    const encodedEndpoint = btoa(endpoint);
    const encodedBody = method !== "GET" && body ? btoa(body) : null;
    let url = `/${method}/${encodedEndpoint}`;
    if (encodedBody) {
      url += `/${encodedBody}`;
    }
    headers.forEach((header) => {
      if (header.key && header.value) {
        url += `?${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`;
      }
    });
    router.push(url, undefined, { shallow: true });
  };

  // Update URL when state changes
  useEffect(() => {
    if (endpoint) {
      updateURL();
    }
  }, [method, endpoint, body, headers]);

  // Populate state from URL on component mount
  useEffect(() => {
    const { method, endpoint, body } = router.query;
    if (method) setMethod(method.toUpperCase());
    if (endpoint) setEndpoint(atob(endpoint));
    if (body) setBody(atob(body));
  }, []);

  const sendRequest = () => {
    handleRequest({
      method,
      endpoint,
      body,
      headers,
      variables,
      setStatus,
      setResponse
    });
  };

  return (
    <div className={styles.restClient}>
      <div className={styles.restClient__controls}>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={styles.restClient__select}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          onBlur={updateURL}
          placeholder="https://api.example.com/resource"
          className={styles.restClient__input}
        />
      </div>

      <HeaderEditor headers={headers} setHeaders={setHeaders} />

      <div
        className={styles.restClient__variablesToggle}
        onClick={() => setIsVariablesVisible(!isVariablesVisible)}
      >
        Variables Editor {isVariablesVisible ? "-" : "+"}
      </div>

      {isVariablesVisible && (
        <VariablesEditor variables={variables} setVariables={setVariables} />
      )}

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={updateURL}
        placeholder='{"key":"value"}'
        className={styles.restClient__textarea}
        rows={10}
        disabled={method === "GET"}
      />

      <button onClick={sendRequest} className={styles.restClient__sendButton}>
        Send Request
      </button>

      <div className={styles.restClient__response}>
        <div className={styles.restClient__status}>
          Status: <span>{status}</span>
        </div>
        <pre className={styles.restClient__responseBody}>{response}</pre>
      </div>
    </div>
  );
}
