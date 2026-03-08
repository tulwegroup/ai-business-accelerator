import { NextResponse } from 'next/server';

// In-memory storage for progress (works on Vercel)
const progressStore = {
  currentWeek: 1,
  productsCreated: 0,
  ideasGenerated: 0,
  contentCreated: 0,
  progress: Array.from({ length: 12 }, (_, i) => ({
    weekNumber: i + 1,
    phase: getPhaseForWeek(i + 1),
    missionTitle: getMissionTitle(i + 1),
    missionStatus: i === 0 ? 'in-progress' : 'not-started',
  })),
};

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

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      currentWeek: progressStore.currentWeek,
      progress: progressStore.progress,
      stats: {
        productsCreated: progressStore.productsCreated,
        ideasGenerated: progressStore.ideasGenerated,
        contentCreated: progressStore.contentCreated,
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

export async function POST(request: Request) {
  try {
    const { weekNumber, status } = await request.json();

    // Update progress in memory
    const existingIndex = progressStore.progress.findIndex(p => p.weekNumber === weekNumber);
    if (existingIndex >= 0) {
      progressStore.progress[existingIndex].missionStatus = status;
    }

    // Update current week if completing
    if (status === 'completed' && weekNumber >= progressStore.currentWeek) {
      progressStore.currentWeek = Math.min(weekNumber + 1, 12);
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
