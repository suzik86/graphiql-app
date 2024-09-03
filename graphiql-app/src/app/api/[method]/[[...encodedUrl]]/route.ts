import { NextRequest, NextResponse } from "next/server";
import { decodeBase64 } from "../../../../utils/base64"; // Adjust the import path as needed

// Handle HTTP methods
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

// Common function to handle requests
async function handleRequest(req: NextRequest, method: string) {
  try {
    const { pathname, searchParams } = req.nextUrl;
    const pathSegments = pathname.split("/").slice(3); // Skip /api/[method]/

    const encodedEndpoint = pathSegments[0];
    const encodedBody = pathSegments.length > 1 ? pathSegments[1] : "";

    // Decode the endpoint and body
    const endpoint = decodeBase64(encodedEndpoint);
    const requestBody = encodedBody ? decodeBase64(encodedBody) : "";

    // Extract query parameters (headers)
    const queryHeaders = Object.fromEntries(searchParams.entries());

    // Normalize all headers to lowercase for consistent handling
    const normalizedQueryHeaders = Object.fromEntries(
      Object.entries(queryHeaders).map(([key, value]) => [
        key.toLowerCase(),
        value,
      ]),
    );

    // Extract Content-Type from normalized query headers if present
    const { "content-type": queryContentType, ...restQueryHeaders } =
      normalizedQueryHeaders;

    // Set default headers (normalize Content-Type)
    const defaultHeaders: Record<string, string> = {
      // Assume Content-Type is set based on editor mode if not overridden
      "Content-Type":
        req.headers.get("Content-Type")?.toLowerCase() || "application/json",
    };

    // Combine headers: Use Content-Type from queryHeaders if present
    const combinedHeaders = {
      ...restQueryHeaders,
      "Content-Type": queryContentType || defaultHeaders["Content-Type"],
    };

    console.log("combinedHeaders:", combinedHeaders);

    // Perform the actual request to the external API
    const externalResponse = await fetch(endpoint, {
      method,
      headers: combinedHeaders, // Pass combined headers
      body: method !== "GET" && method !== "HEAD" ? requestBody : undefined, // Only include body for non-GET requests
    });

    if (!externalResponse.ok) {
      throw new Error(`Failed to fetch data: ${externalResponse.statusText}`);
    }

    // Get the response data
    const data = await externalResponse.text(); // Adjust based on expected response format

    return new NextResponse(data, {
      status: externalResponse.status,
      headers: {
        "Content-Type":
          externalResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
