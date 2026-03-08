import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    }
  };

  return NextResponse.json(health);
}

export async function POST() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY not configured',
        hint: 'Add OPENAI_API_KEY to Vercel environment variables'
      });
    }

    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('[Health Check] Testing OpenAI connection...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Say "OK" and nothing else.' }
      ],
      max_tokens: 10,
    });

    const response = completion.choices[0]?.message?.content;

    console.log('[Health Check] OpenAI response:', response);

    return NextResponse.json({
      success: true,
      message: 'OpenAI connection working!',
      testResponse: response
    });

  } catch (error) {
    console.error('[Health Check] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
