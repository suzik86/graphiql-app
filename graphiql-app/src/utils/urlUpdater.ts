import { Header, Variable } from "../components/RestClient/RestClient";
import { encodeBase64 } from "./base64";

export const updateURL = (
  method: string,
  endpoint: string,
  body: object | string | null,
  headers: Header[],
  variables: Variable[],
) => {
  console.log("URL UPDATE triggered:", {
    method: method,
    endpoint: endpoint,
    body: body,
    headers: headers,
    variables: variables,
  });

  const dataObject = {
    body: body,
    variables: variables,
  };

  const encodedData = encodeBase64(JSON.stringify(dataObject));

  const encodedEndpoint = encodeBase64(endpoint);

  const currentURL = new URL(window.location.href);

  const basePathMatch = currentURL.pathname.match(/^\/[^/]+/);
  const basePath = basePathMatch ? basePathMatch[0] : "";

  const newPath = `${basePath}/${method.toUpperCase()}/${encodedEndpoint}/${encodedData}`;

  currentURL.pathname = newPath;

  const includedHeaders = headers.filter((header) => header.included);
  currentURL.search = new URLSearchParams(
    includedHeaders.map((header) => [
      header.key,
      encodeURIComponent(header.value),
    ]),
  ).toString();

  window.history.pushState({}, "", currentURL.toString());
};
