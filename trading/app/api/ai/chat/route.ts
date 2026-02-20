import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { apiResponse } from '@/lib/middleware';
import { chatWithAI } from '@/lib/llm';

export async function POST(request: Request) {
  try {
    const { user, error } = await withAuth(request);

    if (error || !user) {
      return NextResponse.json(
        apiResponse(null, 'Unauthorized', 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, chat_history, context } = body;

    if (!message || typeof message !== 'string' || message.length === 0) {
      return NextResponse.json(
        apiResponse(null, 'Invalid message', 400),
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        apiResponse(null, 'Message too long', 400),
        { status: 400 }
      );
    }

    // Call AI chat
    const response = await chatWithAI(message, chat_history, context);

    if (!response) {
      return NextResponse.json(
        apiResponse(null, 'Failed to chat with AI', 503),
        { status: 503 }
      );
    }

    return NextResponse.json(
      apiResponse(response, null, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Chat error:', error);
    return NextResponse.json(
      apiResponse(null, 'Chat failed', 500),
      { status: 500 }
    );
  }
}
