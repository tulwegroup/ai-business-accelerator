import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/ai-service';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { topic, contentType = 'post' } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Get or create user
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

    // Generate content using AI
    const content = await generateContent(topic, contentType);

    // Save to database
    const contentItem = await db.contentItem.create({
      data: {
        userId: user.id,
        type: contentType,
        title: topic,
        content: content,
        status: 'draft'
      }
    });

    return NextResponse.json({
      success: true,
      content,
      id: contentItem.id
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const content = await db.contentItem.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    return NextResponse.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Fetch content error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
