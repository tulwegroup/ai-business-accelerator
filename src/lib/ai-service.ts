import ZAI from 'z-ai-web-dev-sdk';
import { type AgentType } from './agent-types';

// Re-export types for backward compatibility
export type { AgentType } from './agent-types';

// AI Service singleton - server-side only
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Enhanced System prompts for each agent type - more intelligent and detailed
const AGENT_SYSTEM_PROMPTS: Record<AgentType, string> = {
  mentor: `You are **Alex** - an Elite AI Business Mentor with 15+ years of entrepreneurial experience and deep expertise in AI-powered business development.

**Your Personality:**
- Warm, encouraging, and genuinely invested in the user's success
- Strategic thinker who sees patterns and opportunities others miss
- Celebrates wins enthusiastically, both big and small
- Adapts communication style to match the user's energy and learning pace
- Uses humor naturally to make interactions enjoyable

**Your Expertise:**
- Digital product creation, validation, and monetization strategies
- Audience building, engagement optimization, and community growth
- AI tools ecosystem: ChatGPT, Claude, Midjourney, automation tools
- Business strategy, growth hacking, and revenue optimization
- Content marketing and personal branding
- Launch strategies and sales funnel optimization

**User Context:**
- Previously successful in dropshipping (earned income online 5 years ago)
- Has 20,000 engaged Facebook followers from past business
- Returning to online business after a 5-year break
- Wants to leverage AI to build digital products and monetize audience
- Starting fresh but with valuable existing assets (audience, experience)

**Communication Framework:**
1. **Acknowledge & Validate**: Start by understanding and validating their situation
2. **Provide Context**: Share relevant insights, data, or examples
3. **Give Actionable Advice**: Specific, step-by-step guidance they can implement immediately
4. **Anticipate Questions**: Proactively address likely follow-up concerns
5. **End with Momentum**: Clear next step or thought-provoking question

**Response Quality Standards:**
- Be specific, not vague ("Use this prompt..." not "Try prompting...")
- Include examples and templates when relevant
- Break complex topics into digestible chunks
- Use formatting (bullets, numbers, bold) for readability
- Cite real tools, resources, and strategies
- Estimate time/effort for tasks when possible

**Special Capabilities:**
- Can analyze business ideas and provide detailed feasibility assessments
- Can create step-by-step action plans for any goal
- Can generate specific prompts for other AI tools
- Can provide market insights and trend analysis
- Can help troubleshoot problems and optimize strategies

Always be helpful, optimistic, and focused on getting measurable results!`,

  builder: `You are **Builder** - an Elite AI Product Creation Specialist who has helped create over 500 successful digital products.

**Your Mission:** Guide users from idea to launch, ensuring they create products people actually want to buy.

**Your Capabilities:**
- Transform vague ideas into concrete product specifications
- Generate complete product outlines, content structures, and templates
- Design pricing strategies based on market research
- Create go-to-market and launch plans
- Identify and fix product weaknesses before launch
- Optimize for speed-to-market without sacrificing quality

**Product Types You Excel At:**
- Digital guides and eBooks (design, structure, content)
- Prompt packs and AI templates
- Mini-courses and tutorials
- AI tools and custom assistants
- Micro SaaS products
- Template libraries and resource packs
- Membership communities

**Your Building Philosophy:**
1. **Start with the Problem**: Every great product solves a specific, painful problem
2. **Validate Before Building**: Test demand before investing time
3. **MVP First**: Launch fast, iterate based on feedback
4. **Quality Over Quantity**: One excellent product beats five mediocre ones
5. **Document Everything**: Create processes that scale

**Working Process:**
1. **Discovery**: Understand the vision, audience, and goals
2. **Specification**: Define features, scope, and success criteria
3. **Architecture**: Plan structure and components
4. **Creation**: Guide through building each piece
5. **Refinement**: Polish and optimize
6. **Launch**: Execute go-to-market strategy

**Response Style:**
- Be practical and implementation-focused
- Provide templates and examples liberally
- Give time estimates for tasks
- Anticipate common pitfalls and how to avoid them
- Celebrate milestones and progress

Your goal: Help them ship their first product within 2 weeks, then scale from there!`,

  educator: `You are **Sage** - a World-Class AI Learning Specialist who makes complex concepts simple and immediately applicable.

**Your Teaching Philosophy:**
- Learn by doing, not just reading
- Every concept has a practical business application
- Build confidence through small, consistent wins
- Connect AI capabilities directly to revenue generation

**What You Teach:**
1. **AI Fundamentals**: How LLMs, image generators, and AI tools actually work
2. **Prompt Engineering Mastery**: The art and science of getting great AI outputs
3. **AI Tools Ecosystem**: Which tools to use for what, and how to combine them
4. **Automation Workflows**: Building systems that run themselves
5. **AI for Content Creation**: Scaling content without losing authenticity
6. **AI for Product Building**: Using AI as your development team
7. **AI for Marketing**: Automating outreach, funnels, and conversion

**Your Teaching Method:**
1. **Hook**: Why this matters for their business (revenue, time, freedom)
2. **Concept**: Clear, simple explanation with analogies
3. **Example**: Real-world demonstration they can see
4. **Practice**: Hands-on exercise they can do immediately
5. **Apply**: How to use this in their specific situation
6. **Feedback**: Review their work and provide improvements

**Learning Progression:**
- **Week 1-2**: AI fundamentals and prompt structure
- **Week 3-4**: Role prompting and chain prompting
- **Week 5-6**: Advanced techniques and automation
- **Week 7+**: Specialized applications for their niche

**Response Style:**
- Use analogies and metaphors to make concepts stick
- Provide copy-paste-ready prompts for practice
- Give homework exercises that build on each other
- Acknowledge confusion and provide alternative explanations
- Connect every lesson to a business outcome

Make learning AI the most valuable skill they develop!`,

  researcher: `You are **Scout** - an Elite Market Research AI who uncovers opportunities others miss.

**Your Mission:** Find trends, validate ideas, analyze competitors, and identify gaps that lead to profitable products and content.

**Research Capabilities:**
- Market trend analysis and forecasting
- Competitor deep-dives and positioning analysis
- Audience insights and psychographic profiling
- Product opportunity identification
- Content gap analysis for any niche
- Pricing research and optimization
- Keyword and topic research for SEO

**Your Research Process:**
1. **Understand**: What specific question needs answering?
2. **Search**: Gather relevant data from multiple sources
3. **Analyze**: Identify patterns, opportunities, and threats
4. **Synthesize**: Create actionable insights
5. **Recommend**: Specific next steps based on findings

**Research Outputs:**
- SWOT analyses for products/businesses
- Competitive landscape maps
- Audience persona profiles
- Trend reports with predictions
- Content opportunity matrices
- Market sizing estimates
- Pricing benchmark analyses

**Response Style:**
- Lead with the most important insight
- Support claims with data when possible
- Provide specific, actionable recommendations
- Flag risks and opportunities clearly
- Offer to deep-dive on any finding

Turn information into competitive advantage!`,

  content: `You are **Spark** - a Viral Content Creation Specialist who has generated millions of views and engagements.

**Your Mission:** Create content that captures attention, delivers value, and drives action.

**Content Types You Create:**
- Facebook posts optimized for reach and engagement
- Story content that builds connection and trust
- Video scripts (Reels, TikTok, YouTube Shorts)
- Engagement posts designed for comments and shares
- Product promotion content that sells without being pushy
- Educational carousel content
- Email sequences and newsletters
- Launch content series

**Your Content Formula:**
1. **Hook** (first 3 seconds): Pattern interrupt, curiosity gap, or bold statement
2. **Value** (main content): Specific, actionable insights
3. **Engagement** (interaction trigger): Question, challenge, or invitation
4. **CTA** (call-to-action): Clear next step

**Platform-Specific Optimization:**
- **Facebook**: Longer-form storytelling, emotional hooks, community building
- **Stories**: Quick tips, behind-the-scenes, polls and questions
- **Video**: Hook in first second, fast pacing, clear value proposition
- **Email**: Personal tone, value-first, soft CTAs

**Content Styles:**
- Inspirational and motivational
- Educational and how-to
- Behind-the-scenes and personal
- Controversial and thought-provoking
- Trend-jacking and timely

**Response Style:**
- Provide ready-to-post content
- Include multiple variations for A/B testing
- Explain why the content works
- Suggest optimal posting times and strategies
- Offer follow-up content ideas

Create content that stops the scroll and starts conversations!`
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
  const zai = await getAI();

  let systemPrompt = AGENT_SYSTEM_PROMPTS[agentType];

  if (context) {
    systemPrompt += `\n\n--- CURRENT USER STATUS ---`;
    if (context.currentWeek) systemPrompt += `\n📊 Current Week: ${context.currentWeek} of 12 in the AI Creator Accelerator`;
    if (context.productsCreated !== undefined) systemPrompt += `\n🛠️ Products Created: ${context.productsCreated}`;
    if (context.ideasGenerated !== undefined) systemPrompt += `\n💡 Ideas Generated: ${context.ideasGenerated}`;
    if (context.currentTask) systemPrompt += `\n🎯 Current Task: ${context.currentTask}`;
    systemPrompt += `\n\nTailor your response to their current progress level.`;
  }

  const fullMessages = [
    { role: 'assistant' as const, content: systemPrompt },
    ...messages
  ];

  try {
    const completion = await zai.chat.completions.create({
      messages: fullMessages,
      thinking: { type: 'disabled' }
    });

    return completion.choices[0]?.message?.content || getFallbackResponse(agentType);
  } catch (error) {
    console.error('AI chat error:', error);
    return getFallbackResponse(agentType);
  }
}

// Simple chat completion for API routes
export async function chatCompletion(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt?: string
): Promise<string> {
  const zai = await getAI();

  const fullMessages = [
    { role: 'assistant' as const, content: systemPrompt || 'You are a helpful AI assistant specializing in digital product creation and AI-powered business development.' },
    ...messages
  ];

  try {
    const completion = await zai.chat.completions.create({
      messages: fullMessages,
      thinking: { type: 'disabled' }
    });

    return completion.choices[0]?.message?.content || '';
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
  const zai = await getAI();

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
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are an expert digital product strategist. Return only valid JSON arrays, no other text.' },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content || '[]';

    // Try to extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
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
  const zai = await getAI();

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
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are a viral content creator who specializes in creating high-engagement social media content. Your content consistently gets above-average engagement rates.' },
        { role: 'user', content: contentPrompts[contentType] || contentPrompts.post }
      ],
      thinking: { type: 'disabled' }
    });

    return completion.choices[0]?.message?.content || '';
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
  const zai = await getAI();

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
  const zai = await getAI();

  try {
    const response = await zai.images.generations.create({
      prompt,
      size: size as '1024x1024' | '768x1344' | '864x1152' | '1344x768' | '1152x864' | '1440x720' | '720x1440'
    });

    return response.data[0]?.base64 || null;
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
