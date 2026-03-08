import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
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

    // Get progress for all 12 weeks
    const progress = await db.weeklyProgress.findMany({
      where: { userId: user.id },
      orderBy: { weekNumber: 'asc' }
    });

    // Get counts
    const productsCreated = await db.product.count({
      where: { userId: user.id }
    });

    const ideasGenerated = await db.productIdea.count({
      where: { userId: user.id }
    });

    const contentCreated = await db.contentItem.count({
      where: { userId: user.id }
    });

    return NextResponse.json({
      success: true,
      currentWeek: user.currentWeek,
      progress,
      stats: {
        productsCreated,
        ideasGenerated,
        contentCreated
      }
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { weekNumber, status, reflection } = await request.json();

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

    // Update or create progress
    const existing = await db.weeklyProgress.findFirst({
      where: { userId: user.id, weekNumber }
    });

    if (existing) {
      await db.weeklyProgress.update({
        where: { id: existing.id },
        data: {
          missionStatus: status,
          reflection,
          completedAt: status === 'completed' ? new Date() : null
        }
      });
    } else {
      await db.weeklyProgress.create({
        data: {
          userId: user.id,
          weekNumber,
          phase: getPhaseForWeek(weekNumber),
          missionTitle: getMissionTitle(weekNumber),
          missionStatus: status,
          reflection
        }
      });
    }

    // Update user's current week if completing
    if (status === 'completed' && weekNumber >= user.currentWeek) {
      await db.userProfile.update({
        where: { id: user.id },
        data: { currentWeek: Math.min(weekNumber + 1, 12) }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Progress updated'
    });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

function getPhaseForWeek(week: number): string {
  if (week <= 2) return 'Phase 1: AI Literacy';
  if (week <= 5) return 'Phase 2: Prompt Engineering';
  if (week <= 8) return 'Phase 3: Product Creation';
  if (week <= 10) return 'Phase 4: Audience Monetization';
  return 'Phase 5: Automation & Scale';
}

function getMissionTitle(week: number): string {
  const titles: Record<number, string> = {
    1: 'AI Content Assistant',
    2: '30-Day Content Engine',
    3: 'Prompt Structure Mastery',
    4: 'Role Prompting Deep Dive',
    5: 'Chain Prompting & Marketing',
    6: 'First Digital Product',
    7: 'Micro AI Tool/Assistant',
    8: 'Landing Page & Launch Plan',
    9: 'Engagement Campaigns',
    10: 'Product Testing & Feedback',
    11: 'Automation Agents',
    12: 'Scale & Optimize'
  };
  return titles[week] || `Week ${week} Mission`;
}
