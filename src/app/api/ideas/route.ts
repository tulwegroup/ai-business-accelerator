import { NextRequest, NextResponse } from 'next/server';
import { generateProductIdeas } from '@/lib/ai-service';
import { db } from '@/lib/db';

// Define the idea type
interface GeneratedIdea {
  title: string;
  category: string;
  targetAudience: string;
  problemSolved: string;
  buildComplexity: string;
  monetizationModel: string;
  priceRange: string;
  marketingAngle: string;
  potentialScore: number;
  description?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { niche, count = 10 } = await request.json();

    // Get user
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

    const audienceSize = user.facebookFollowers || 20000;

    // Generate ideas using AI
    const ideas = await generateProductIdeas(niche || 'entrepreneurship and AI tools', audienceSize, count);

    // Save ideas to database
    for (const idea of ideas.slice(0, count)) {
      await db.productIdea.create({
        data: {
          userId: user.id,
          title: idea.title || 'Untitled Idea',
          description: idea.description || idea.problemSolved || '',
          category: idea.category || 'Digital Product',
          targetAudience: idea.targetAudience || 'Entrepreneurs',
          problemSolved: idea.problemSolved || '',
          buildComplexity: idea.buildComplexity || 'Medium',
          monetizationModel: idea.monetizationModel || 'One-time purchase',
          priceRange: idea.priceRange || '$19-$49',
          marketingAngle: idea.marketingAngle || '',
          potentialScore: idea.potentialScore || 50
        }
      });
    }

    return NextResponse.json({
      success: true,
      ideas: ideas.slice(0, count),
      totalGenerated: ideas.length
    });
  } catch (error) {
    console.error('Ideas generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const ideas = await db.productIdea.findMany({
      orderBy: { potentialScore: 'desc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      ideas
    });
  } catch (error) {
    console.error('Fetch ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}
