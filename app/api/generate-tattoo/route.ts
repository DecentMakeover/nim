import { NextResponse, NextRequest } from 'next/server';

// The URL of your deployed Cloud Run service
const CLOUD_RUN_URL = "https://tattoo-gen-orb3x5u66q-el.a.run.app/generate-tattoo/";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log(`Forwarding prompt to Cloud Run: ${prompt}`);

    const cloudRunResponse = await fetch(CLOUD_RUN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      // It's good practice to set a timeout for external API calls
      // Vercel Serverless Functions have a default execution timeout (e.g., 10s or more depending on plan)
      // Ensure your Cloud Run service can respond within this limit.
      // The `fetch` API in Node.js (via Next.js) might use AbortController for timeouts.
    });

    console.log(`Cloud Run response status: ${cloudRunResponse.status}`);

    if (!cloudRunResponse.ok) {
      const errorBody = await cloudRunResponse.text(); // Get raw error body
      console.error(`Cloud Run service returned an error: ${cloudRunResponse.status}`, errorBody);
      return NextResponse.json(
        { 
          error: 'Failed to generate tattoo from Cloud Run service.', 
          details: `Status: ${cloudRunResponse.status}, Body: ${errorBody}` 
        }, 
        { status: 500 }
      );
    }

    const responseData = await cloudRunResponse.json();

    // We expect `image_base64` from your Cloud Run service.
    // If your Cloud Run service provides a public URL for the image (e.g., from GCS), 
    // it should ideally be in a field like `image_url` or `public_url`.
    // For now, we map `image_base64` to `image` and `image_path` (if provided and it's a public URL) to `imagePath`.
    // The frontend currently expects `imagePath` for the gallery.
    // If your Cloud Run service saves to GCS and returns `image_path` as the GCS public URL, this will work.
    // Otherwise, the gallery feature will need adjustment or a different way to get persistent URLs.

    return NextResponse.json({
      image: responseData.image_base64, // Assuming Cloud Run returns this
      imagePath: responseData.image_path,  // Assuming Cloud Run returns a public URL here if it saves persistently
      textResponse: responseData.text_response // Forward if present
    });

  } catch (error) {
    console.error('Error in Next.js API route calling Cloud Run:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Internal server error calling tattoo generation service.', details: errorMessage }, { status: 500 });
  }
} 