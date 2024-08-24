interface Header {
    key: string;
    value: string;
    included: boolean;
}

interface Variable {
    key: string;
    value: string;
    included: boolean;
}

interface HandleRequestParams {
    method: string;
    endpoint: string;
    body: string;
    headers: Header[];
    variables: Variable[];
    setStatus: (status: string) => void;
    setResponse: (response: string) => void;
}

function encodeBase64(str: string): string {
    return btoa(str);
}

function createRouteURL(
    method: string,
    endpoint: string,
    body: string | null,
    headers: Header[]
): string {
    const encodedEndpoint = encodeBase64(endpoint);
    const encodedBody = body ? encodeBase64(body) : null;
    let url = `/${method}/${encodedEndpoint}`;

    if (encodedBody) {
        url += `/${encodedBody}`;
    }

    const queryParams = headers
        .filter(header => header.key && header.included)
        .map(header => `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`)
        .join("&");

    if (queryParams) {
        url += `?${queryParams}`;
    }

    return url;
}

export async function handleRequest({
    method,
    endpoint,
    body,
    headers,
    variables,
    setStatus,
    setResponse,
}: HandleRequestParams): Promise<void> {
    try {
        let requestBody = body;

        if (method !== "GET") {
            const includedVariables = variables
                .filter(variable => variable.included)
                .reduce((acc, { key, value }) => {
                    acc[key] = value;
                    return acc;
                }, {} as Record<string, string>);

            requestBody = JSON.stringify({
                ...JSON.parse(body || "{}"),
                ...includedVariables,
            });
        }

        const routeURL = createRouteURL(method, endpoint, requestBody, headers);

        const validHeaders = headers.reduce((acc, { key, value, included }) => {
            if (included && key && value) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, string>);

        const response = await fetch(routeURL, {
            method,
            headers: validHeaders,
            body: method !== "GET" ? requestBody : undefined,
        });

        const contentType = response.headers.get('Content-Type');
        const responseText = await response.text();
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? JSON.parse(responseText) : responseText;

        setStatus(`${response.status} ${response.statusText}`);
        setResponse(JSON.stringify(data, null, 2));

    } catch (error) {
        setStatus("Error");
        setResponse((error as Error).message);
    }
}
