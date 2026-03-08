import { NextRequest, NextResponse } from 'next/server';
import { runAgentTask, type AgentTaskType, AGENT_TASKS } from '@/lib/autonomous-agents';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { taskType, params } = await request.json();

    if (!taskType) {
      return NextResponse.json({ error: 'Task type is required' }, { status: 400 });
    }

    // Get task configuration
    const taskConfig = AGENT_TASKS[taskType as AgentTaskType];
    if (!taskConfig) {
      return NextResponse.json({ error: 'Invalid task type' }, { status: 400 });
    }

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

    // Add user context to params
    const enrichedParams = {
      ...params,
      userId: user.id,
      currentWeek: user.currentWeek,
      audienceSize: user.facebookFollowers
    };

    // Execute the autonomous task
    const result = await runAgentTask(
      taskConfig.agentType,
      taskType as AgentTaskType,
      enrichedParams
    );

    // Save the task result to database
    await db.userTask.create({
      data: {
        userId: user.id,
        title: taskConfig.name,
        description: result.finalOutput,
        category: taskType,
        priority: 'high',
        status: result.success ? 'completed' : 'pending'
      }
    });

    return NextResponse.json({
      success: result.success,
      taskType,
      taskName: taskConfig.name,
      steps: result.steps,
      finalOutput: result.finalOutput,
      artifacts: result.artifacts,
      estimatedTime: taskConfig.estimatedTime
    });
  } catch (error) {
    console.error('Agent task error:', error);
    return NextResponse.json(
      { error: 'Failed to execute agent task' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available agent tasks
  return NextResponse.json({
    success: true,
    tasks: Object.entries(AGENT_TASKS).map(([id, task]) => ({
      id,
      ...task
    }))
  });
}
