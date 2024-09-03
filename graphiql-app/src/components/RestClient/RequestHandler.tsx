import React, { useState } from "react";
import styles from "./RequestHandler.module.scss"; // Ensure correct path
import { encodeBase64 } from "../../utils/base64";
import RequestBodyEditor from "./RequestBodyEditor";

interface RequestHandlerProps {
  method: string;
  endpoint: string;
  headers: { key: string; value: string; included: boolean }[];
  body: object | string | null;
  editorMode: "json" | "text";
  variables: { key: string; value: string; included: boolean }[];
}

const RequestHandler: React.FC<RequestHandlerProps> = ({
  method,
  endpoint,
  headers,
  body,
  editorMode,
  variables, // Add variables to props destructuring
}) => {
  const [response, setResponse] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const replacePlaceholders = (
    text: string,
    variables: { key: string; value: string; included: boolean }[],
  ) => {
    let updatedText = text;
    variables.forEach((variable) => {
      if (variable.included) {
        const placeholder = `{{${variable.key}}}`;
        updatedText = updatedText.replace(
          new RegExp(placeholder, "g"),
          variable.value,
        );
      }
    });
    return updatedText;
  };

  const sendRequest = async () => {
    try {
      const bodyString =
        body === null
          ? ""
          : typeof body === "string"
            ? body
            : JSON.stringify(body);

      // Replace placeholders in the body with actual values
      const bodyWithVariables = replacePlaceholders(bodyString, variables);

      // Encode endpoint and body
      const encodedEndpoint = encodeBase64(endpoint);
      const encodedBody = bodyWithVariables
        ? encodeBase64(bodyWithVariables)
        : "";

      // Prepare query parameters for headers
      const queryParams = headers
        .filter((header) => header.included)
        .map(
          (header) =>
            `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`,
        )
        .join("&");

      // Construct the URL with query parameters
      const url = `/api/${method}/${encodedEndpoint}${encodedBody ? `/${encodedBody}` : ""}${queryParams ? `?${queryParams}` : ""}`;
      console.log("BODY IN REQUEST:", bodyWithVariables);
      console.log("EDITOR MODE IN REQUEST:", editorMode);

      // Prepare headers based on editor mode
      const requestHeaders: Record<string, string> = {
        "Content-Type":
          editorMode === "json" ? "application/json" : "text/plain",
      };
      console.log("requestHeaders IN REQUEST:", requestHeaders);

      // Send the request
      const response = await fetch(url, {
        method: method,
        headers: requestHeaders,
        body: method === "GET" ? undefined : bodyWithVariables, // Include modified body only for methods other than GET
      });

      const data = await response.text(); // Adjust based on expected response format
      setStatus(response.status.toString());
      setResponse(data);
    } catch (error) {
      console.error("Error sending request:", error);
      setStatus("500");
      setResponse("Internal Server Error");
    }
  };

  return (
    <div>
      <button onClick={sendRequest} className={styles.sendButton}>
        Send Request
      </button>

      <div className={styles.response}>
        <div className={styles.status}>
          Status: <span>{status}</span>
        </div>
        <div>Response:</div>
        <RequestBodyEditor
          body={response} // No need to update body
          editorMode="json" // Assuming response is JSON. Adjust if needed.
          readOnly={true}
        />
      </div>
    </div>
  );
};

export default RequestHandler;
