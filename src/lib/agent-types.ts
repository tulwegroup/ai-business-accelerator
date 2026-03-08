// Agent Types - shared between client and server
export type AgentType = 'mentor' | 'builder' | 'educator' | 'researcher' | 'content';

// Agent Personas - static data safe for client
export const AGENT_PERSONAS: Record<AgentType, { 
  name: string; 
  avatar: string; 
  specialty: string;
  description: string;
}> = {
  mentor: {
    name: 'AI Business Mentor',
    avatar: '🚀',
    specialty: 'Strategy & Growth',
    description: "I'm here to guide your AI entrepreneurship journey. Let's build something amazing together!"
  },
  builder: {
    name: 'Product Builder Agent',
    avatar: '🛠️',
    specialty: 'Product Creation',
    description: "I help you create digital products from idea to launch. What shall we build today?"
  },
  educator: {
    name: 'AI Learning Guide',
    avatar: '📚',
    specialty: 'AI Education',
    description: "I teach AI concepts in a practical, hands-on way. Ready to level up your AI skills?"
  },
  researcher: {
    name: 'Market Research Agent',
    avatar: '🔍',
    specialty: 'Research & Trends',
    description: "I find trends, opportunities, and insights. What would you like to explore?"
  },
  content: {
    name: 'Content Creator Agent',
    avatar: '✨',
    specialty: 'Content Creation',
    description: "I create engaging content for social media. Let's make something viral!"
  }
};

// Quick suggestions for each agent and context
export function getQuickSuggestions(context: string, agentType: AgentType): string[] {
  const suggestions: Record<AgentType, Record<string, string[]>> = {
    mentor: {
      start: [
        "What should I work on first?",
        "Help me set goals for this week",
        "What's the best AI tool to start with?",
        "How do I monetize my audience?"
      ],
      progress: [
        "Review my progress so far",
        "What should I focus on next?",
        "How can I speed up my results?",
        "Help me overcome a challenge"
      ],
      stuck: [
        "I'm feeling overwhelmed",
        "I need motivation",
        "Help me prioritize",
        "What would you do in my situation?"
      ]
    },
    builder: {
      start: [
        "I have a product idea",
        "Help me brainstorm products",
        "What should I build first?",
        "Guide me through product creation"
      ],
      progress: [
        "Review my product concept",
        "Help me with pricing",
        "Create a launch plan",
        "Improve my product"
      ],
      stuck: [
        "I'm stuck on my product",
        "Help me finish my product",
        "Review my progress",
        "What's missing from my product?"
      ]
    },
    educator: {
      start: [
        "Teach me prompt engineering",
        "What AI tools should I learn?",
        "Explain how AI can help me",
        "Start from the basics"
      ],
      progress: [
        "Give me a practice exercise",
        "Test my knowledge",
        "What should I learn next?",
        "Advanced AI techniques"
      ],
      stuck: [
        "I don't understand something",
        "Explain this differently",
        "Give me a simpler example",
        "How do I apply this?"
      ]
    },
    researcher: {
      start: [
        "What's trending in my niche?",
        "Research my competitors",
        "Find content opportunities",
        "Analyze my audience"
      ],
      progress: [
        "Deep dive on this topic",
        "Find more opportunities",
        "What are my competitors doing?",
        "Validate my idea"
      ],
      stuck: [
        "I need market insights",
        "Help me research this",
        "Find gaps in the market",
        "What's working for others?"
      ]
    },
    content: {
      start: [
        "Create a viral post for me",
        "Generate content ideas",
        "Write a video script",
        "Create engagement content"
      ],
      progress: [
        "Improve my content",
        "Make this more engaging",
        "Add a strong hook",
        "Optimize for my audience"
      ],
      stuck: [
        "I have writer's block",
        "Help me with content ideas",
        "Review my content",
        "Make this viral-worthy"
      ]
    }
  };

  return suggestions[agentType][context as keyof typeof suggestions[AgentType]] || suggestions[agentType].start;
}
