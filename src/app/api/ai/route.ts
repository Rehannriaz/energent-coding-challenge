import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set");
      return NextResponse.json({ 
        error: "API key not configured",
        apiKey: null 
      });
    }

    return NextResponse.json({ 
      apiKey,
      success: true 
    });
  } catch (error) {
    console.error("Error in AI API route:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      apiKey: null 
    }, { status: 500 });
  }
}