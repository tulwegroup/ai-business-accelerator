import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for content
const contentStore: Array<{
  id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
}> = [];

let contentIdCounter = 0;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      content: contentStore.slice(0, 30)
    });
  } catch (error) {
    console.error('Fetch content error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { topic, contentType = 'post' } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    console.log('[Content] Generating content for:', topic);
    console.log('[Content] Type:', contentType);
    console.log('[Content] OPENAI_API_KEY set:', !!process.env.OPENAI_API_KEY);

    // Generate content using AI
    let content: string;

    if (process.env.OPENAI_API_KEY) {
      content = await generateContentWithOpenAI(topic, contentType);
    } else {
      content = getDefaultContent(topic, contentType);
    }

    // Save to memory
    const contentItem = {
      id: `content-${++contentIdCounter}`,
      type: contentType,
      title: topic,
      content,
      status: 'draft',
      createdAt: new Date(),
    };
    contentStore.unshift(contentItem);

    return NextResponse.json({
      success: true,
      content,
      id: contentItem.id
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

async function generateContentWithOpenAI(topic: string, contentType: string): Promise<string> {
  const OpenAI = (await import('openai')).default;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const contentPrompts: Record<string, string> = {
    post: `Create a highly engaging Facebook post about "${topic}".

Context: User has 20K Facebook followers from past dropshipping success, returning after 5-year break.

Structure:
1. HOOK: First line must stop the scroll (curiosity gap, bold statement, or pattern interrupt)
2. VALUE: 3-5 specific, actionable tips or insights
3. ENGAGEMENT: Question or challenge to spark comments
4. CTA: Clear next step

Requirements:
- Use line breaks for readability (mobile-first)
- Maximum 2-3 emojis placed strategically
- Feel authentic and personal
- Make it share-worthy

Provide the post ready to copy and paste.`,

    story: `Create a 5-slide Facebook story sequence about "${topic}".

For each slide provide:
- Visual description (what to show)
- Text overlay (what to write)
- Engagement element (poll, question, sticker)

Make it interactive and memorable.`,

    'video-script': `Write a 45-second video script about "${topic}" for Facebook Reels.

Format:
[0:00-0:03] HOOK - Must stop scroll immediately
[0:03-0:15] VALUE - Quick actionable tips
[0:15-0:35] DEEPEN - Expand with example
[0:35-0:45] CTA - Clear next step

Include visual cues in [brackets] and text overlays.`,

    engagement: `Create an engagement-optimized Facebook post about "${topic}" designed to get 50+ comments.

Requirements:
- Provocative question OR bold take
- Encourages sharing experiences
- Creates community feeling
- Irresistible to respond to`,

    promotion: `Write a promotional Facebook post about "${topic}" that sells without being salesy.

Structure:
1. Lead with value/insight
2. Bridge to common problem
3. Introduce solution naturally
4. Proof/results
5. Soft CTA

Make it feel like helpful advice from a friend.`
  };

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a viral content creator specializing in Facebook. Create engaging, authentic content.' },
      { role: 'user', content: contentPrompts[contentType] || contentPrompts.post }
    ],
    max_tokens: 2000,
    temperature: 0.8,
  });

  return completion.choices[0]?.message?.content || '';
}

function getDefaultContent(topic: string, contentType: string): string {
  return `Here's a ${contentType} about "${topic}":

🚀 **Ready to take action?**

I've been exploring ${topic} and wanted to share what I've learned...

Here are 3 key insights:

1. Start small and iterate
2. Focus on providing value first
3. Use AI to speed up the process

What's your experience with ${topic}? Drop a comment below! 👇

---

**Note:** To get AI-generated content, please configure your OPENAI_API_KEY in Vercel environment variables.`;
}
