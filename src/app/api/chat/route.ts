import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory chat history (resets on server restart, but works)
const chatHistories = new Map<string, Array<{ role: 'user' | 'assistant'; content: string }>>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, agentType = 'mentor' } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('[Chat] Received message:', message);
    console.log('[Chat] Agent type:', agentType);
    console.log('[Chat] OPENAI_API_KEY set:', !!process.env.OPENAI_API_KEY);

    // Get or create chat history for this session
    const sessionId = 'default';
    let history = chatHistories.get(sessionId) || [];

    // Add user message to history
    history.push({ role: 'user', content: message });

    // Get AI response
    let aiResponse: string;

    if (process.env.OPENAI_API_KEY) {
      console.log('[Chat] Using OpenAI...');
      aiResponse = await getOpenAIResponse(message, history, agentType);
    } else {
      console.log('[Chat] No OpenAI key, using fallback');
      aiResponse = getFallbackResponse(agentType, message);
    }

    // Add AI response to history
    history.push({ role: 'assistant', content: aiResponse });

    // Keep only last 20 messages
    if (history.length > 20) {
      history = history.slice(-20);
    }
    chatHistories.set(sessionId, history);

    console.log('[Chat] Response generated successfully');

    return NextResponse.json({
      success: true,
      response: aiResponse,
      agent: agentType
    });

  } catch (error) {
    console.error('[Chat] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OpenAI response with proper prompts
async function getOpenAIResponse(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  agentType: string
): Promise<string> {
  const OpenAI = (await import('openai')).default;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemPrompt = getSystemPrompt(agentType);

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  ];

  console.log('[OpenAI] Calling API with model gpt-4o-mini...');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 2000,
    temperature: 0.7,
  });

  const response = completion.choices[0]?.message?.content;

  if (!response) {
    throw new Error('OpenAI returned empty response');
  }

  console.log('[OpenAI] Response received, length:', response.length);
  return response;
}

// System prompts for each agent
function getSystemPrompt(agentType: string): string {
  const prompts: Record<string, string> = {
    mentor: `You are Alex, an elite AI business mentor helping a former dropshipping entrepreneur with 20,000 Facebook followers who's returning to online business after 5 years. They want to use AI to build digital products.

Your style:
- Be specific and actionable - give exact steps, not vague advice
- Reference their 20K followers as a key asset
- Provide copy-paste-ready content when possible
- Don't repeat yourself - move the conversation forward
- Give real numbers: time estimates, pricing, tools

Context about the user:
- Successfully earned income from dropshipping 5 years ago
- Has 20,000 engaged Facebook followers from that business
- Wants to leverage AI tools to create and sell digital products
- Currently in Week 1 of a 12-week accelerator program

Always end with a clear next step or question.`,

    builder: `You are Builder, a product creation specialist who has shipped 500+ digital products. You help users create products fast.

Your approach:
- Ruthless prioritization - cut everything that doesn't matter
- Ship in 2 weeks or less
- Use AI for 80% of creation
- Pre-sell when possible to validate

Context: User has 20K Facebook followers from past dropshipping success, returning after 5-year break.

Give actual outlines, templates, and step-by-step instructions. Be practical, not theoretical.`,

    educator: `You are Sage, an AI learning specialist who teaches practical AI skills.

Your teaching style:
- Just-in-time learning (teach what they need NOW)
- Every lesson has a 5-minute exercise
- Connect every skill to making money
- Give copy-paste-ready prompts

Context: User wants to use AI to build digital products and monetize their 20K Facebook audience.

Start simple, add complexity progressively. Always give something to try immediately.`,

    researcher: `You are Scout, a market research specialist who finds opportunities.

Your capabilities:
- Market trend analysis
- Competitor research
- Audience insights
- Product opportunity identification

Context: User has 20K Facebook followers and wants to create digital products.

Give specific insights with data. Name actual competitors, tools, products. Provide validation steps.`,

    content: `You are Spark, a viral content creator who has generated millions of views.

Your content formula:
1. Hook (stop the scroll)
2. Value (deliver insights)
3. Engagement (drive interaction)
4. CTA (clear next step)

Context: User has 20K Facebook followers they want to re-engage and monetize.

Always provide ready-to-post content. Give multiple variations. Explain why it works.`
  };

  return prompts[agentType] || prompts.mentor;
}

// Fallback response when OpenAI is not available
function getFallbackResponse(agentType: string, message: string): string {
  return `I'm here to help! 🚀

However, I notice that the OPENAI_API_KEY environment variable is not configured. Please add your OpenAI API key to Vercel's environment variables:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add a variable named \`OPENAI_API_KEY\`
3. Set the value to your OpenAI API key (starts with \`sk-proj-\`)
4. Redeploy the application

Once configured, I'll be able to provide personalized advice for your journey to monetize your 20K Facebook followers with AI-powered digital products!`;
}
