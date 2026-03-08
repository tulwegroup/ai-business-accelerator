import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for ideas
const ideasStore: Array<{
  id: string;
  title: string;
  description: string;
  category: string;
  targetAudience: string;
  problemSolved: string;
  buildComplexity: string;
  monetizationModel: string;
  priceRange: string;
  marketingAngle: string;
  potentialScore: number;
  status: string;
  createdAt: Date;
}> = [];

let ideasIdCounter = 0;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      ideas: ideasStore.slice(0, 50)
    });
  } catch (error) {
    console.error('Fetch ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { niche, count = 10 } = await request.json();

    console.log('[Ideas] Generating ideas for niche:', niche);
    console.log('[Ideas] OPENAI_API_KEY set:', !!process.env.OPENAI_API_KEY);

    // Generate ideas using AI
    let ideas: any[] = [];

    if (process.env.OPENAI_API_KEY) {
      ideas = await generateIdeasWithOpenAI(niche || 'entrepreneurship and AI tools', count);
    } else {
      // Fallback ideas
      ideas = getDefaultIdeas(niche || 'entrepreneurship');
    }

    // Save ideas to memory
    for (const idea of ideas.slice(0, count)) {
      ideasStore.unshift({
        id: `idea-${++ideasIdCounter}`,
        title: idea.title || 'Untitled Idea',
        description: idea.description || '',
        category: idea.category || 'Digital Product',
        targetAudience: idea.targetAudience || 'Entrepreneurs',
        problemSolved: idea.problemSolved || '',
        buildComplexity: idea.buildComplexity || 'Medium',
        monetizationModel: idea.monetizationModel || 'One-time',
        priceRange: idea.priceRange || '$19-$49',
        marketingAngle: idea.marketingAngle || '',
        potentialScore: idea.potentialScore || 50,
        status: 'idea',
        createdAt: new Date(),
      });
    }

    // Sort by potential score
    ideasStore.sort((a, b) => b.potentialScore - a.potentialScore);

    return NextResponse.json({
      success: true,
      ideas: ideas.slice(0, count),
      totalGenerated: ideas.length
    });
  } catch (error) {
    console.error('Ideas generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ideas', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

async function generateIdeasWithOpenAI(niche: string, count: number): Promise<any[]> {
  const OpenAI = (await import('openai')).default;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `Generate ${count} unique digital product ideas for someone with 20,000 Facebook followers in the "${niche}" niche.

IMPORTANT:
- They want products that can be created quickly (1-2 weeks)
- Products should be priced between $19-$297
- Focus on AI-powered or AI-related products

For each idea, provide a JSON object with these fields:
{
  "title": "Catchy, specific product name",
  "description": "2-3 sentence description",
  "category": "One of: AI Tool, Digital Guide, Prompt Pack, Mini Course, Template, Micro SaaS",
  "targetAudience": "Specific segment",
  "problemSolved": "Clear pain point",
  "buildComplexity": "Easy, Medium, or Hard",
  "monetizationModel": "One-time or Subscription",
  "priceRange": "e.g., $27-$47",
  "marketingAngle": "Unique selling proposition",
  "potentialScore": 1-100
}

Return ONLY a valid JSON array. No markdown.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a digital product strategist. Return only valid JSON arrays.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 4000,
    temperature: 0.7,
  });

  const response = completion.choices[0]?.message?.content || '[]';
  const jsonMatch = response.match(/\[[\s\S]*\]/);

  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return [];
}

function getDefaultIdeas(niche: string): any[] {
  return [
    {
      title: "AI Prompt Pack for " + niche,
      description: "50+ battle-tested prompts to help entrepreneurs in " + niche + " save 10+ hours per week using AI.",
      category: "Prompt Pack",
      targetAudience: niche + " entrepreneurs",
      problemSolved: "Wasting time on repetitive tasks that AI could handle",
      buildComplexity: "Easy",
      monetizationModel: "One-time",
      priceRange: "$27-$47",
      marketingAngle: "Save 10 hours per week with these AI prompts",
      potentialScore: 85
    },
    {
      title: "The Complete AI Business Starter Kit",
      description: "Templates, checklists, and workflows to launch an AI-powered business in 30 days.",
      category: "Digital Guide",
      targetAudience: "Beginners starting an online business",
      problemSolved: "Overwhelmed by where to start with AI tools",
      buildComplexity: "Medium",
      monetizationModel: "One-time",
      priceRange: "$47-$97",
      marketingAngle: "Launch your AI business in 30 days",
      potentialScore: 80
    },
    {
      title: "Facebook Content AI Assistant",
      description: "Pre-built AI prompts and templates to create 30 days of engaging Facebook content in 2 hours.",
      category: "Template",
      targetAudience: "Facebook page owners with 5K+ followers",
      problemSolved: "Struggling to create consistent content",
      buildComplexity: "Easy",
      monetizationModel: "One-time",
      priceRange: "$19-$37",
      marketingAngle: "Create 30 days of content in 2 hours",
      potentialScore: 90
    }
  ];
}
