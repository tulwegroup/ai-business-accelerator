// Chat API Route - Updated for proper context serialization
import { NextRequest, NextResponse } from 'next/server';
import { chatWithAgent, type AgentType } from '@/lib/ai-service';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { message, context, agentType = 'mentor' } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get or create user session
    let user = await db.userProfile.findFirst();
    if (!user) {
      user = await db.userProfile.create({
        data: {
          name: 'Creator',
          email: 'creator@example.com',
          background: 'dropshipping',
          facebookFollowers: 20000,
        }
      });
    }

    // Save user message
    await db.chatMessage.create({
      data: {
        userId: user.id,
        role: 'user',
        content: message,
        context: JSON.stringify({ agentType, ...context }) || agentType
      }
    });

    // Get recent chat history for context
    const recentMessages = await db.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Format messages for AI
    const formattedMessages = recentMessages
      .reverse()
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    // Get stats for context
    const productsCreated = await db.product.count({ where: { userId: user.id } });
    const ideasGenerated = await db.productIdea.count({ where: { userId: user.id } });

    // Get AI response using the agent system
    const aiResponse = await chatWithAgent(
      agentType as AgentType,
      formattedMessages,
      {
        currentWeek: user.currentWeek,
        productsCreated,
        ideasGenerated,
        currentTask: message
      }
    );

    // Save AI response
    await db.chatMessage.create({
      data: {
        userId: user.id,
        role: 'assistant',
        content: aiResponse,
        context: JSON.stringify({ agentType })
      }
    });

    return NextResponse.json({
      success: true,
      response: aiResponse,
      agent: agentType
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
