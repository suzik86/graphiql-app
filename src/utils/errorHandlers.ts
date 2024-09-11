export const handleClientError = (status: number) => {
  switch (status) {
    case 400:
      return "Client Error: Bad Request";
    case 401:
      return "Client Error: Unauthorized";
    case 403:
      return "Client Error: Forbidden";
    case 404:
      return "Client Error: Not Found";
    default:
      return "Client Error: Unexpected";
  }
};

export const handleServerError = (status: number) => {
  switch (status) {
    case 500:
      return "Server Error: Internal Server Error";
    case 502:
      return "Server Error: Bad Gateway";
    case 503:
      return "Server Error: Service Unavailable";
    case 504:
      return "Server Error: Gateway Timeout";
    default:
      return "Server Error: Unexpected";
  }
};
