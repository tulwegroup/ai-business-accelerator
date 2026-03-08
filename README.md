# 🚀 AI Creator Business Accelerator

An AI-powered platform designed to transform entrepreneurs from AI beginners to AI-powered business owners. Built for creators who want to leverage AI tools to build digital products, monetize their audience, and scale their online business.

## ✨ Features

### 🎯 AI Business Operating System
- **Dashboard**: Real-time overview of your progress, stats, and current mission
- **Product Ideas Engine**: Generate 50+ AI-powered product ideas tailored to your audience
- **Content Engine**: Create Facebook posts, stories, video scripts, and engagement content
- **Product Builder**: Step-by-step digital product creation workflow

### 📚 12-Week Accelerator Program
A structured journey through 5 phases:
1. **Phase 1 (Weeks 1-2)**: AI Literacy & Tool Discovery
2. **Phase 2 (Weeks 3-5)**: Prompt Engineering Mastery
3. **Phase 3 (Weeks 6-8)**: AI Product Creation
4. **Phase 4 (Weeks 9-10)**: Audience Monetization
5. **Phase 5 (Weeks 11-12)**: Automation & Scale

### 🤖 AI Mentor (AI Business Builder)
Your personal AI business partner that:
- Suggests product ideas based on your audience
- Guides product creation step-by-step
- Helps craft effective prompts
- Assists with marketing strategy
- Analyzes audience feedback
- Provides motivation and celebrates wins

### 🛠️ Tool Discovery
Curated list of cutting-edge AI tools for:
- AI Reasoning (ChatGPT, Claude)
- Image Generation (Midjourney, DALL-E)
- Video Generation (Runway, Pika)
- Automation (Zapier, Make)
- App Building (Cursor, v0)
- Productivity (Notion AI)

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 with App Router |
| Language | TypeScript 5 |
| Database | Prisma ORM with SQLite |
| UI Components | shadcn/ui (New York style) |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| AI Integration | z-ai-web-dev-sdk |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/tulwegroup/ai-business-accelerator.git
cd ai-business-accelerator

# Install dependencies
bun install

# Set up the database
bun run db:push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./db/custom.db"
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/           # AI Mentor chat API
│   │   ├── content/        # Content generation API
│   │   ├── ideas/          # Product ideas generator
│   │   ├── products/       # Product management
│   │   └── progress/       # Weekly progress tracking
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main application
│   └── globals.css         # Global styles
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── ai-service.ts       # AI integration
│   └── db.ts               # Prisma client
└── hooks/                  # Custom React hooks
```

## 🎯 User Profile

This platform is designed for:
- Previously successful entrepreneurs (e.g., dropshipping)
- ~5 years of inactivity in the online business space
- Existing Facebook audience (~20,000 followers)
- Interest in AI tools and digital product creation
- Goal to reach thousands of people quickly

## 🚀 Deployment on Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tulwegroup/ai-business-accelerator)

### Manual Deploy

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables:
   - `DATABASE_URL`: Your database connection string (for production, consider using Vercel Postgres or PlanetScale)
4. Deploy!

### Database for Production

For production deployment, consider using:
- **Vercel Postgres** - Seamless integration with Vercel
- **PlanetScale** - Serverless MySQL database
- **Supabase** - PostgreSQL with built-in auth

Update your `DATABASE_URL` environment variable in Vercel dashboard.

## 📊 Available Scripts

```bash
# Development
bun run dev          # Start development server

# Build
bun run build        # Build for production

# Database
bun run db:push      # Push schema to database
bun run db:generate  # Generate Prisma client

# Linting
bun run lint         # Run ESLint
```

## 🎨 Customization

### Theming
The application uses Tailwind CSS with CSS variables for theming. Customize colors in `src/app/globals.css`.

### Components
All UI components are from shadcn/ui. Customize them in `src/components/ui/`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

---

Built with ❤️ for AI entrepreneurs. Powered by [Next.js](https://nextjs.org) and [shadcn/ui](https://ui.shadcn.com).
