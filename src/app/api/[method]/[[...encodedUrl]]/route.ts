import { NextRequest, NextResponse } from "next/server";
import { decodeBase64 } from "../../../../utils/base64";
import {
  handleClientError,
  handleServerError,
} from "../../../../utils/errorHandlers";

export async function GET(req: NextRequest) {
  return handleRequest(req, "GET");
}

export async function POST(req: NextRequest) {
  return handleRequest(req, "POST");
}

export async function PUT(req: NextRequest) {
  return handleRequest(req, "PUT");
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req, "DELETE");
}

async function handleRequest(req: NextRequest, method: string) {
  try {
    const { pathname, searchParams } = req.nextUrl;
    const pathSegments = pathname.split("/").slice(3);

    const encodedEndpoint = pathSegments[0];
    const encodedBody = pathSegments.length > 1 ? pathSegments[1] : "";
    const endpoint = decodeBase64(encodedEndpoint);
    const requestBody = encodedBody ? decodeBase64(encodedBody) : "";
    const queryHeaders = Object.fromEntries(searchParams.entries());
    const normalizedQueryHeaders = Object.fromEntries(
      Object.entries(queryHeaders).map(([key, value]) => [
        key.toLowerCase(),
        value,
      ]),
    );

    const { "content-type": queryContentType, ...restQueryHeaders } =
      normalizedQueryHeaders;

    const defaultHeaders: Record<string, string> = {
      "Content-Type":
        req.headers.get("Content-Type")?.toLowerCase() || "application/json",
    };
    const combinedHeaders = {
      ...restQueryHeaders,
      "Content-Type": queryContentType || defaultHeaders["Content-Type"],
    };

    const externalResponse = await fetch(endpoint, {
      method,
      headers: combinedHeaders,
      body: method !== "GET" && method !== "HEAD" ? requestBody : undefined,
    });

    const responseStatus = externalResponse.status;

    if (!externalResponse.ok) {
      const errorMessage =
        responseStatus >= 400 && responseStatus < 500
          ? handleClientError(responseStatus)
          : handleServerError(responseStatus);

      return NextResponse.json(
        { error: errorMessage },
        { status: responseStatus },
      );
    }

    const data = await externalResponse.text();

    return new NextResponse(data, {
      status: externalResponse.status,
      headers: {
        "Content-Type":
          externalResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}