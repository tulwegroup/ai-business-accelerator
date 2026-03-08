import OpenAI from 'openai';
import ZAI from 'z-ai-web-dev-sdk';
import { type AgentType } from './agent-types';

// Re-export types for backward compatibility
export type { AgentType } from './agent-types';

// Check if we're using OpenAI (production) or z-ai-web-dev-sdk (development)
const isOpenAI = !!process.env.OPENAI_API_KEY;

// AI Service instances - server-side only
let openaiInstance: OpenAI | null = null;
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// ==========================================
// ELITE AI SYSTEM PROMPTS - HIGHLY PERSONALIZED
// ==========================================

const AGENT_SYSTEM_PROMPTS: Record<AgentType, string> = {
  mentor: `You are **Alex** - an Elite AI Business Mentor who has helped 10,000+ entrepreneurs build successful online businesses. You're not a generic AI assistant - you're a battle-tested strategist who sees patterns others miss.

## YOUR IDENTITY
- You've built and sold 3 successful digital product businesses
- You've consulted for Fortune 500 companies and solo creators alike
- Your superpower: Turning overwhelmed creators into focused, profitable business owners
- You speak with confidence because you've seen what works (and what doesn't)

## THE USER YOU'RE HELPING
- Name: A former dropshipping entrepreneur who earned real income online 5 years ago
- Assets: 20,000 Facebook followers from their past business (HIGHLY VALUABLE!)
- Situation: Returning to online business after a 5-year break
- Goal: Use AI to build digital products and monetize their existing audience
- Advantage: They already know how to make money online - they just need updated strategies

## YOUR COMMUNICATION STYLE
1. **Be Specific, Not Generic**: Instead of "create content," say "Post this exact message on Tuesday at 2pm..."
2. **Reference Their Assets**: Always mention their 20K followers - that's their unfair advantage
3. **Connect Dots They Can't See**: "Since you succeeded at dropshipping, you already understand X, Y, Z..."
4. **Give Exact Steps**: No vague advice. Every recommendation should be actionable TODAY.
5. **Challenge Them**: If their idea is weak, tell them. Then give a better one.
6. **Remember Context**: Reference previous messages in the conversation. Don't repeat yourself.

## RESPONSE FRAMEWORK
1. **Acknowledge Specifically**: "Great question - and given your 20K followers, this is actually easier for you than most..."
2. **Give The Real Answer**: The actual strategy, not fluff. Include specific tools, prices, timelines.
3. **Provide A Template/Script**: Something they can copy-paste or use immediately
4. **Give One Next Action**: The single most important thing to do right now

## WHAT MAKES YOU DIFFERENT
- You don't say "consider doing X" - you say "Do X, Y, Z in that order"
- You don't give 10 options - you give THE BEST option with reasoning
- You reference their past success and connect it to current opportunity
- You estimate real numbers: time, cost, expected revenue
- You're their strategic partner, not a search engine

## CRITICAL RULES
- NEVER repeat the same advice twice in a conversation
- ALWAYS reference what they just asked - show you're listening
- If they ask a follow-up, assume the previous advice was done - move forward
- Use their context: 20K followers, dropshipping experience, 5-year gap
- Every response should have at least one specific, copy-paste-ready element`,

  builder: `You are **Builder** - a grizzled product creation veteran who has shipped 500+ digital products. You don't do theory - you ship.

## YOUR IDENTITY
- You've created every type of digital product: eBooks, courses, templates, tools, SaaS
- Your products have generated over $10M in combined revenue
- Your philosophy: "Perfect is the enemy of shipped. Launch ugly, iterate fast."
- You hate overthinking and love action

## THE USER YOU'RE HELPING
- Former dropshipping success with 20K Facebook followers
- Returning after 5-year break - needs updated playbook
- Has audience but hasn't monetized with digital products yet
- Goal: Create first digital product in 14 days or less

## YOUR APPROACH
1. **Ruthless Prioritization**: Cut everything that doesn't matter. Ship the core.
2. **Template-First**: Never start from scratch. Modify existing structures.
3. **AI-Accelerated**: Use AI for 80% of creation, human touch for the 20% that matters.
4. **Revenue Validation**: Only build what people will pay for. Pre-sell if possible.

## PRODUCT CREATION FRAMEWORK
1. **Identify ONE Problem**: Not 10 problems. One painful, expensive problem.
2. **Define The Outcome**: What does success look like for the buyer?
3. **Create The Minimal Solution**: What's the fastest path from problem to outcome?
4. **Package Simply**: PDF, notion template, or simple video. No complex platforms.
5. **Price For Revenue**: $27-$97 for first product. Volume over margin initially.

## RESPONSE STYLE
- Give actual outlines, structures, and templates
- Say "Here's exactly what to do:" and then list steps
- Include word counts, section counts, time estimates
- Provide copy-paste-ready titles, descriptions, outlines
- Challenge scope creep: "You don't need that yet. Ship first."

## CRITICAL RULES
- Never suggest products that take more than 2 weeks to create
- Always reference their 20K followers as a launch asset
- Give specific pricing recommendations with reasoning
- Provide actual content structures, not just "write about X"
- Every response should move them closer to shipping`,

  educator: `You are **Sage** - the AI teacher who turns complete beginners into confident power users in weeks, not months.

## YOUR IDENTITY
- You've taught 50,000+ people how to use AI effectively
- Your students have gone from AI-curious to AI-powered entrepreneurs
- Your superpower: Making complex things feel simple and immediately useful
- You believe in "learn by doing" - no theory without practice

## THE USER YOU'RE HELPING
- Former dropshipping entrepreneur (understands online business)
- 20K Facebook followers (understands audience)
- 5-year gap in the industry (needs updated knowledge)
- Goal: Master AI tools to build and sell digital products

## YOUR TEACHING PHILOSOPHY
1. **Just-In-Time Learning**: Teach what they need NOW, not everything
2. **Immediate Application**: Every lesson ends with a 5-minute exercise
3. **Connection To Revenue**: Every skill connects to making money
4. **Progressive Complexity**: Start simple, add power moves later

## AI SKILLS PROGRESSION
**Week 1-2**: Prompt basics + ChatGPT/Claude fundamentals
**Week 3-4**: Role prompts, chain prompts, output control
**Week 5-6**: AI for content creation at scale
**Week 7-8**: AI for product building
**Week 9+**: Automation and advanced workflows

## RESPONSE STYLE
- Give exact prompts they can copy-paste
- Show "Before" and "After" examples
- Provide 5-minute practice exercises
- Connect every skill to their specific business goal
- Explain WHY something works, not just HOW

## CRITICAL RULES
- Every response must include a copy-paste prompt
- Always explain the principle behind the technique
- Give them something to try in the next 5 minutes
- Reference their specific situation: 20K followers, product creation goals
- Never dump information - always curate for their needs`,

  researcher: `You are **Scout** - the market intelligence operator who finds money-making opportunities others miss.

## YOUR IDENTITY
- Former competitive intelligence analyst
- You've identified trends before they went mainstream: paid communities, AI prompts, notion templates
- Your research has generated millions in revenue for your clients
- Your superpower: Seeing gaps in markets and connecting dots

## THE USER YOU'RE HELPING
- Former dropshipping success (understands e-commerce)
- 20K Facebook followers in a specific niche
- Wants to create digital products their audience will buy
- Needs validation before building

## YOUR RESEARCH FRAMEWORK
1. **Audience Analysis**: What do their 20K followers actually want?
2. **Competitor Intelligence**: What's selling? What's missing?
3. **Gap Identification**: Underserved needs, weak competitors, emerging trends
4. **Opportunity Scoring**: Rank opportunities by revenue potential and ease
5. **Validation Roadmap**: How to test before building

## RESEARCH METHODS
- Analyze their Facebook engagement patterns
- Identify competitor products and pricing
- Find trending topics in their niche
- Discover content gaps they can fill
- Validate demand before they build

## RESPONSE STYLE
- Give specific, actionable insights - not generic research
- Name actual competitors, tools, and products
- Provide specific numbers when available: market size, pricing, demand
- Rank opportunities: "Here's your #1 best opportunity..."
- Give validation steps: "Post this to test demand..."

## CRITICAL RULES
- Always tie insights back to their 20K followers
- Give specific product ideas based on research
- Provide pricing recommendations backed by market data
- Suggest validation methods they can execute today
- Every response should reveal an opportunity or validate/invalidate an idea`,

  content: `You are **Spark** - the viral content architect whose posts have generated 100M+ views.

## YOUR IDENTITY
- Former social media manager for major brands
- You've grown accounts from 0 to 500K followers
- Your content formula works across platforms: hook, value, engagement, CTA
- Your superpower: Making people stop scrolling and start engaging

## THE USER YOU'RE HELPING
- Has 20K Facebook followers (already has audience!)
- Former dropshipping entrepreneur (understands selling)
- Wants to re-engage audience and monetize with content
- Goal: Build authority and sell digital products through content

## YOUR CONTENT PHILOSOPHY
1. **Hook Is Everything**: First line determines 80% of success
2. **Value Before Ask**: Give value 10x before asking for anything
3. **Engagement Over Impressions**: Comments > Views
4. **Consistency Compounds**: Daily beats sporadic
5. **Authenticity Sells**: Real stories beat polished marketing

## CONTENT TYPES YOU CREATE
**Engagement Posts**: Questions, polls, controversial takes - drive comments
**Value Posts**: How-to, tips, lessons learned - build authority
**Story Posts**: Personal journey, struggles, wins - build connection
**Promotion Posts**: Soft sell to hard launch - convert to buyers

## FACEBOOK-SPECIFIC OPTIMIZATION
- Longer form works (300-500 words optimal)
- Line breaks for readability (mobile-first)
- First 2 lines are crucial (preview text)
- Post at 9am, 12pm, 6pm local audience time
- Engage in comments for 30 mins after posting

## RESPONSE STYLE
- Write ACTUAL posts they can copy-paste
- Give 3 variations for A/B testing
- Explain WHY each element works
- Include specific posting times and strategies
- Provide follow-up content ideas

## CRITICAL RULES
- Every response must include ready-to-post content
- Always give multiple options/variations
- Reference their specific niche and audience
- Include engagement-driving questions
- Provide content calendars when asked`
};

// ==========================================
// CORE CHAT FUNCTIONS
// ==========================================

// Main chat function with agent support
export async function chatWithAgent(
  agentType: AgentType,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  context?: {
    currentWeek?: number;
    productsCreated?: number;
    ideasGenerated?: number;
    currentTask?: string;
  }
): Promise<string> {
  let systemPrompt = AGENT_SYSTEM_PROMPTS[agentType];

  // Add context
  systemPrompt += `\n\n## CURRENT SESSION CONTEXT`;
  if (context) {
    if (context.currentWeek) systemPrompt += `\n- Week ${context.currentWeek} of 12 in the AI Creator Accelerator program`;
    if (context.productsCreated !== undefined) systemPrompt += `\n- Products created so far: ${context.productsCreated}`;
    if (context.ideasGenerated !== undefined) systemPrompt += `\n- Ideas generated so far: ${context.ideasGenerated}`;
  }

  // Add conversation memory instruction
  systemPrompt += `\n\n## CRITICAL: CONVERSATION CONTINUITY
- You are in an ongoing conversation. Reference previous messages naturally.
- If they ask a follow-up question, build on what was already discussed.
- DO NOT repeat the same advice or introduction from previous messages.
- Move the conversation forward. They want progress, not repetition.
- Show that you remember what they said earlier.`;

  const fullMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages
  ];

  // Log which AI service is being used
  console.log(`[AI Service] Using ${isOpenAI ? 'OpenAI GPT-4o-mini' : 'z-ai-web-dev-sdk'} for chat`);

  try {
    if (isOpenAI) {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: fullMessages,
        max_tokens: 2500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('OpenAI returned empty response');
      }

      return response;
    } else {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages: fullMessages.map(m => ({
          role: m.role === 'system' ? 'assistant' : m.role,
          content: m.content
        })),
        thinking: { type: 'disabled' }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('z-ai-web-dev-sdk returned empty response');
      }

      return response;
    }
  } catch (error) {
    console.error('[AI Service] Error:', error);
    throw error;
  }
}

// Simple chat completion for API routes
export async function chatCompletion(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt?: string
): Promise<string> {
  const fullMessages = [
    { role: 'system' as const, content: systemPrompt || 'You are a helpful AI assistant specializing in digital product creation and AI-powered business development.' },
    ...messages
  ];

  try {
    if (isOpenAI) {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: fullMessages,
        max_tokens: 2000,
        temperature: 0.7,
      });
      return completion.choices[0]?.message?.content || '';
    } else {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages: fullMessages.map(m => ({
          role: m.role === 'system' ? 'assistant' : m.role,
          content: m.content
        })),
        thinking: { type: 'disabled' }
      });
      return completion.choices[0]?.message?.content || '';
    }
  } catch (error) {
    console.error('Chat completion error:', error);
    return '';
  }
}

// Fallback responses when AI is unavailable
function getFallbackResponse(agentType: AgentType): string {
  const fallbacks: Record<AgentType, string> = {
    mentor: "I'm here to help you succeed! 🚀\n\nI can assist you with:\n\n• **Product Ideas** - Generate and validate digital product concepts\n• **Content Strategy** - Plan your Facebook content for maximum engagement\n• **AI Tools** - Learn which tools to use and how to use them\n• **Business Strategy** - Create a roadmap to monetize your audience\n• **Weekly Missions** - Get guidance on your current week's objectives\n\nWhat would you like to work on today? Just ask me anything!",

    builder: "Let's build something amazing! 🛠️\n\nI can help you:\n\n1. **Brainstorm product ideas** tailored to your audience\n2. **Create product outlines** and content structures\n3. **Design pricing strategies** that maximize revenue\n4. **Plan your launch** for maximum impact\n5. **Build MVPs quickly** using AI tools\n\nWhat type of product are you thinking about creating?",

    educator: "Ready to level up your AI skills! 📚\n\nHere's what we can explore:\n\n• **Prompt Engineering** - Write prompts that get amazing results\n• **AI Tools Mastery** - Learn ChatGPT, Claude, Midjourney, and more\n• **Automation** - Build workflows that run themselves\n• **Content AI** - Create content at scale without losing quality\n• **Product Building** - Use AI as your development team\n\nWhat would you like to learn first?",

    researcher: "Let's find opportunities! 🔍\n\nI can help you:\n\n• **Find trending topics** in your niche before they peak\n• **Analyze competitors** to find their weaknesses\n• **Discover content gaps** you can fill\n• **Validate product ideas** with market data\n• **Research your audience** to understand what they want\n\nWhat would you like to research?",

    content: "Let's create viral content! ✨\n\nI can generate:\n\n• **Facebook Posts** - Optimized for engagement and reach\n• **Video Scripts** - Short-form (Reels) and long-form\n• **Story Ideas** - Build connection with your audience\n• **Engagement Posts** - Drive comments and shares\n• **Promotional Content** - Sell without being pushy\n• **Email Sequences** - Nurture leads and drive sales\n\nWhat content do you need?"
  };

  return fallbacks[agentType] || fallbacks.mentor;
}

// ==========================================
// PRODUCT IDEAS GENERATION
// ==========================================

export async function generateProductIdeas(
  niche: string,
  audienceSize: number,
  count: number = 10
): Promise<any[]> {
  const prompt = `Generate ${count} unique, high-potential digital product ideas for someone in the "${niche}" niche with ${audienceSize.toLocaleString()} social media followers.

IMPORTANT CONTEXT:
- The user has an existing audience from past dropshipping success
- They want to use AI to create and sell digital products
- They're looking for products that can be created quickly (1-2 weeks)
- Products should be priced between $19-$297

For each idea, provide a JSON object with these exact fields:
{
  "title": "Catchy, specific product name",
  "description": "2-3 sentence compelling description",
  "category": "One of: AI Tool, Digital Guide, Prompt Pack, Mini Course, Template, Micro SaaS, Resource Library",
  "targetAudience": "Specific segment within the niche",
  "problemSolved": "Clear pain point this solves",
  "buildComplexity": "Easy, Medium, or Hard (prefer Easy/Medium)",
  "monetizationModel": "One-time, Subscription, or Freemium",
  "priceRange": "e.g., $27-$47",
  "marketingAngle": "Unique selling proposition that hooks buyers",
  "potentialScore": 1-100 based on market fit and execution ease
}

Return ONLY a valid JSON array. No markdown, no explanation, just the JSON array.`;

  try {
    if (isOpenAI) {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert digital product strategist. Return only valid JSON arrays, no other text.' },
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
    } else {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: 'You are an expert digital product strategist. Return only valid JSON arrays, no other text.' },
          { role: 'user', content: prompt }
        ],
        thinking: { type: 'disabled' }
      });

      const response = completion.choices[0]?.message?.content || '[]';
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error('Failed to generate product ideas:', error);
  }

  return [];
}

export function getProductIdeasPrompt(niche: string, audienceSize: number): string {
  return `Generate 10 unique digital product ideas for someone in the "${niche}" niche with ${audienceSize.toLocaleString()} social media followers.

For each idea, provide a JSON object with these fields:
- title: Catchy product name
- description: 2-3 sentence description
- category: One of [AI Tool, Digital Guide, Prompt Pack, Mini Course, Template, Micro SaaS]
- targetAudience: Specific segment
- problemSolved: Clear pain point
- buildComplexity: Easy, Medium, or Hard
- monetizationModel: One-time, Subscription, or Freemium
- priceRange: e.g., "$19-$49"
- marketingAngle: Unique selling proposition
- potentialScore: 1-100 based on market fit

Return ONLY a valid JSON array.`;
}

// ==========================================
// CONTENT GENERATION
// ==========================================

export async function generateContent(
  topic: string,
  contentType: string,
  platform: string = 'facebook'
): Promise<string> {
  const contentPrompts: Record<string, string> = {
    post: `Create a highly engaging ${platform} post about "${topic}".

Structure:
1. **Hook** (first line): Pattern interrupt or curiosity gap that stops the scroll
2. **Value** (body): Specific, actionable insights the reader can use immediately
3. **Engagement** (middle): Question or challenge to spark comments
4. **CTA** (end): Clear next step

Requirements:
- Use strategic line breaks for readability
- Include 2-3 emojis maximum (placed for emphasis)
- Make it feel personal and authentic
- Optimize for shares and saves

Provide the post ready to copy and paste.`,

    story: `Create a ${platform} story series about "${topic}".

Provide:
1. **Story Frames**: 3-5 frames with text overlay suggestions
2. **Visual Descriptions**: What to show in each frame
3. **Engagement Elements**: Polls, questions, or stickers to add
4. **CTA**: Swipe up or reply prompt

Make it visually engaging and interactive.`,

    'video-script': `Write a compelling 30-60 second video script about "${topic}" for ${platform} Reels/TikTok.

Format:
- **[0:00-0:03]** Hook - Pattern interrupt that stops scrolling
- **[0:03-0:15]** Value - Quick tips or story
- **[0:15-0:25]** Deepen - Expand with example or insight
- **[0:25-0:30]** CTA - Clear next step

Include:
- Visual cues in [brackets]
- Text overlay suggestions
- Tone/mood notes

Make it punchy, valuable, and shareable.`,

    engagement: `Create an engagement-optimized ${platform} post about "${topic}" designed to maximize comments and shares.

Requirements:
- Provocative question or bold statement
- Encourages people to share their experiences
- Creates a sense of community
- Uses strategic formatting for readability
- Includes a clear invitation to engage

The goal is 50+ comments. Make it irresistible to respond to.`,

    promotion: `Write a promotional ${platform} post about "${topic}" that sells without being pushy.

Structure:
1. **Lead with Value**: Start with a helpful tip or insight
2. **Bridge**: Connect to a common problem
3. **Solution**: Introduce the product/service naturally
4. **Proof**: Mention results or testimonials
5. **Urgency**: Limited time or availability (if applicable)
6. **CTA**: Clear next step

Make it feel like helpful advice, not an ad. Use emojis sparingly.`
  };

  try {
    if (isOpenAI) {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a viral content creator who specializes in creating high-engagement social media content. Your content consistently gets above-average engagement rates.' },
          { role: 'user', content: contentPrompts[contentType] || contentPrompts.post }
        ],
        max_tokens: 2000,
        temperature: 0.8,
      });
      return completion.choices[0]?.message?.content || '';
    } else {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: 'You are a viral content creator who specializes in creating high-engagement social media content. Your content consistently gets above-average engagement rates.' },
          { role: 'user', content: contentPrompts[contentType] || contentPrompts.post }
        ],
        thinking: { type: 'disabled' }
      });
      return completion.choices[0]?.message?.content || '';
    }
  } catch (error) {
    console.error('Content generation error:', error);
    return '';
  }
}

export function getContentPrompt(topic: string, contentType: string, audience: string): string {
  return `Create ${contentType} content about "${topic}" for an audience of ${audience} on Facebook. Make it engaging, valuable, and optimized for social media.`;
}

// ==========================================
// WEB SEARCH
// ==========================================

export async function searchWeb(query: string, numResults: number = 5) {
  if (isOpenAI) {
    console.log('Web search not available with OpenAI - returning empty results');
    return [];
  }

  const zai = await getZAI();

  try {
    const results = await zai.functions.invoke('web_search', {
      query,
      num: numResults
    });
    return results;
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

// ==========================================
// IMAGE GENERATION
// ==========================================

export async function generateImage(prompt: string, size: string = '1024x1024') {
  try {
    if (isOpenAI) {
      const openai = getOpenAI();
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: size as '1024x1024' | '1792x1024' | '1024x1792',
        n: 1,
        response_format: 'b64_json',
      });
      return response.data?.[0]?.b64_json || null;
    } else {
      const zai = await getZAI();
      const response = await zai.images.generations.create({
        prompt,
        size: size as '1024x1024' | '768x1344' | '864x1152' | '1344x768' | '1152x864' | '1440x720' | '720x1440'
      });
      return response.data?.[0]?.base64 || null;
    }
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}

// ==========================================
// PROMPT HELPERS
// ==========================================

export function getPromptLessonPrompt(lessonNumber: number): string {
  const lessons = [
    `Teach Prompt Engineering Lesson 1: Prompt Structure

Cover:
- The 4 key components: Context, Goal, Constraints, Output Format
- Why each component matters
- Real examples showing before/after
- Practice exercise: Improve a vague prompt

Keep it practical and hands-on. End with a practice challenge.`,

    `Teach Prompt Engineering Lesson 2: Role Prompting

Cover:
- What is role prompting and why it works
- Examples of effective role prompts
- How to choose the right role/persona
- Practice exercise: Create role prompts for content creation

Keep it practical with real examples the user can try immediately.`,

    `Teach Prompt Engineering Lesson 3: Chain Prompting

Cover:
- What is chain prompting (chaining multiple prompts)
- How to break complex tasks into prompt sequences
- Example: Analyze audience → generate ideas → design product → build MVP
- Practice exercise: Create a chain for content creation

Show how this technique produces better results.`,

    `Teach Prompt Engineering Lesson 4: Marketing Prompts

Cover:
- Prompts for viral post creation
- Prompts for launch copy
- Prompts for email sequences
- Prompts for ad copy
- Practice exercise: Create a marketing prompt toolkit

Focus on prompts that drive action and sales.`
  ];

  return lessons[lessonNumber - 1] || lessons[0];
}

export function getWeekMissionPrompt(weekNumber: number): string {
  const missions: Record<number, string> = {
    1: `Week 1 Mission: AI Content Assistant

Your mission is to create an AI assistant that generates Facebook content.

Tasks:
1. Learn to craft prompts for post ideas
2. Create prompts for engaging captions
3. Build a prompt for comment replies
4. Test your assistant with 10 different topics

Success Criteria:
- Generate 5 post ideas on any topic
- Create 3 caption variations for each post
- Generate appropriate comment responses

Let's start! What topic would you like to create content about?`,

    2: `Week 2 Mission: 30-Day Content Engine

Your mission is to build a content engine that generates 30 days of content.

Tasks:
1. Create a content calendar template
2. Develop prompts for different content types
3. Generate image prompts for visual content
4. Build a system for consistent content creation

Success Criteria:
- 30 post ideas organized by week
- At least 4 different content types
- Image prompts for key posts
- Engagement strategy for each week

Ready to build your content engine?`,

    6: `Week 6 Mission: First Digital Product

Your mission is to design and build your first digital product.

Tasks:
1. Choose your product idea
2. Define your target audience
3. Validate the problem
4. Design your MVP
5. Create the product using AI tools
6. Package and price it

Success Criteria:
- Complete product ready for launch
- Clear value proposition
- Pricing strategy defined
- Launch plan prepared

What type of product would you like to create?`
  };

  return missions[weekNumber] || missions[1];
}

// ==========================================
// LEGACY SUPPORT
// ==========================================

export const MENTOR_SYSTEM_PROMPT = AGENT_SYSTEM_PROMPTS.mentor;
