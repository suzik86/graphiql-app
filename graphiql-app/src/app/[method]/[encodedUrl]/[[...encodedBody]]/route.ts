import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { method: string; encodedUrl: string } }) {
  const { method, encodedUrl } = params;
  const url = atob(encodedUrl);

  console.log("Decoded URL in GET handler:", url); // Логируем декодированный URL
  console.log("Request URL:", request.url); // Логируем исходный запрос

  const headers = Object.fromEntries(new URL(request.url).searchParams.entries());

  try {
    const response = await fetch(url, {
      method,
      headers,
    });

    const contentType = response.headers.get('Content-Type');
    const data = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    return NextResponse.json({ status: response.status, data });
  } catch (error) {
    console.error("Error in GET handler:", (error as Error).message);
    return NextResponse.json({ status: 500, error: (error as Error).message });
  }
}

export async function POST(request: NextRequest, { params }: { params: { method: string; encodedUrl: string; encodedBody: string } }) {
  const { method, encodedUrl, encodedBody } = params;
  const url = atob(encodedUrl);
  const body = encodedBody ? atob(encodedBody) : undefined;

  console.log("Decoded URL in POST handler:", url); // Логируем декодированный URL
  console.log("Decoded Body in POST handler:", body); // Логируем декодированное тело

  const headers = Object.fromEntries(new URL(request.url).searchParams.entries());

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const contentType = response.headers.get('Content-Type');
    const data = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    return NextResponse.json({ status: response.status, data });
  } catch (error) {
    console.error("Error in POST handler:", (error as Error).message);
    return NextResponse.json({ status: 500, error: (error as Error).message });
  }
}
