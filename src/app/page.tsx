'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Lightbulb, MessageSquare, Calendar, TrendingUp,
  Wrench, FileText, ChevronRight, Sparkles, Target,
  BookOpen, Zap, Users, DollarSign, CheckCircle2,
  Circle, Plus, ArrowRight, Star, Clock,
  RefreshCw, Copy, Play, Menu, X, Bot, Wand2,
  Trophy, Gift, Heart, Flame, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import EnhancedChat from '@/components/chat/enhanced-chat';
import AutonomousAgentsPanel from '@/components/agents/autonomous-agents-panel';

// Types
interface ProductIdea {
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
}

interface ContentItem {
  id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

interface WeeklyProgress {
  weekNumber: number;
  phase: string;
  missionTitle: string;
  missionStatus: string;
}

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// Celebration component
function CelebrationModal({ show, onClose, achievement }: { show: boolean; onClose: () => void; achievement: string }) {
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0 }}
        className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white text-center shadow-2xl max-w-sm mx-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Achievement Unlocked!</h3>
        <p className="text-white/90">{achievement}</p>
        <Button onClick={onClose} className="mt-4 bg-white text-orange-500 hover:bg-white/90">
          Awesome!
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function AICreatorAccelerator() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State
  const [currentWeek, setCurrentWeek] = useState(1);
  const [ideas, setIdeas] = useState<ProductIdea[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [progress, setProgress] = useState<WeeklyProgress[]>([]);
  const [stats, setStats] = useState({ productsCreated: 0, ideasGenerated: 0, contentCreated: 0 });
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState('');
  
  // Input states
  const [ideaNiche, setIdeaNiche] = useState('entrepreneurship and AI tools');
  const [contentTopic, setContentTopic] = useState('');
  const [contentType, setContentType] = useState('post');

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, ideasRes, contentRes] = await Promise.all([
          fetch('/api/progress'),
          fetch('/api/ideas'),
          fetch('/api/content')
        ]);
        
        const progressData = await progressRes.json();
        const ideasData = await ideasRes.json();
        const contentData = await contentRes.json();
        
        if (progressData.success) {
          setCurrentWeek(progressData.currentWeek);
          setProgress(progressData.progress);
          setStats(progressData.stats);
        }
        if (ideasData.success) {
          setIdeas(ideasData.ideas);
        }
        if (contentData.success) {
          setContent(contentData.content);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, []);

  // API Functions
  const generateIdeas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: ideaNiche, count: 10 })
      });
      const data = await res.json();
      if (data.success) {
        setIdeas(prev => [...data.ideas, ...prev]);
        setStats(prev => ({ ...prev, ideasGenerated: prev.ideasGenerated + data.ideas.length }));
        setXp(prev => prev + 50);
        setCelebrationText(`Generated ${data.ideas.length} new product ideas! +50 XP`);
        setShowCelebration(true);
        toast.success(`Generated ${data.ideas.length} new product ideas!`);
      }
    } catch (error) {
      toast.error('Failed to generate ideas');
    }
    setIsLoading(false);
  };

  const generateContent = async () => {
    if (!contentTopic) {
      toast.error('Please enter a topic');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: contentTopic, contentType })
      });
      const data = await res.json();
      if (data.success) {
        setContent(prev => [{ 
          id: data.id, 
          title: contentTopic, 
          type: contentType, 
          content: data.content, 
          status: 'draft', 
          createdAt: new Date().toISOString() 
        }, ...prev]);
        setStats(prev => ({ ...prev, contentCreated: prev.contentCreated + 1 }));
        setXp(prev => prev + 25);
        toast.success('Content generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate content');
    }
    setIsLoading(false);
  };

  const selectIdea = async (idea: ProductIdea) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          type: idea.category.toLowerCase().includes('tool') ? 'tool' : 'guide',
          targetAudience: idea.targetAudience,
          problemStatement: idea.problemSolved,
          ideaId: idea.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setStats(prev => ({ ...prev, productsCreated: prev.productsCreated + 1 }));
        setXp(prev => prev + 100);
        setCelebrationText(`Started building "${idea.title}"! +100 XP`);
        setShowCelebration(true);
        setActiveModule('products');
        toast.success(`Started building "${idea.title}"!`);
      }
    } catch (error) {
      toast.error('Failed to select idea');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Roadmap data
  const roadmap = [
    { week: 1, phase: 'Phase 1', title: 'AI Content Assistant', description: 'Create an AI assistant for Facebook content', color: 'from-emerald-400 to-teal-500', icon: Bot },
    { week: 2, phase: 'Phase 1', title: '30-Day Content Engine', description: 'Build a content generation system', color: 'from-emerald-400 to-teal-500', icon: FileText },
    { week: 3, phase: 'Phase 2', title: 'Prompt Structure Mastery', description: 'Master the 4-component prompt structure', color: 'from-amber-400 to-orange-500', icon: Wand2 },
    { week: 4, phase: 'Phase 2', title: 'Role Prompting Deep Dive', description: 'Learn effective role prompting', color: 'from-amber-400 to-orange-500', icon: Sparkles },
    { week: 5, phase: 'Phase 2', title: 'Chain Prompting & Marketing', description: 'Chain prompts for complex tasks', color: 'from-amber-400 to-orange-500', icon: Zap },
    { week: 6, phase: 'Phase 3', title: 'First Digital Product', description: 'Design and build your first product', color: 'from-purple-400 to-violet-500', icon: Wrench },
    { week: 7, phase: 'Phase 3', title: 'Micro AI Tool/Assistant', description: 'Build a micro SaaS or AI assistant', color: 'from-purple-400 to-violet-500', icon: Rocket },
    { week: 8, phase: 'Phase 3', title: 'Landing Page & Launch Plan', description: 'Create launch strategy', color: 'from-purple-400 to-violet-500', icon: Target },
    { week: 9, phase: 'Phase 4', title: 'Engagement Campaigns', description: 'Launch engagement campaigns', color: 'from-rose-400 to-pink-500', icon: Heart },
    { week: 10, phase: 'Phase 4', title: 'Product Testing & Feedback', description: 'Test and refine products', color: 'from-rose-400 to-pink-500', icon: Flame },
    { week: 11, phase: 'Phase 5', title: 'Automation Agents', description: 'Build automation agents', color: 'from-cyan-400 to-blue-500', icon: Zap },
    { week: 12, phase: 'Phase 5', title: 'Scale & Optimize', description: 'Scale your AI business', color: 'from-cyan-400 to-blue-500', icon: Trophy },
  ];

  const getProgressStatus = (week: number) => {
    const found = progress.find(p => p.weekNumber === week);
    return found?.missionStatus || (week < currentWeek ? 'completed' : 'not-started');
  };

  // Modules configuration
  const modules = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'chat', label: 'AI Mentor', icon: MessageSquare },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'ideas', label: 'Idea Engine', icon: Lightbulb },
    { id: 'content', label: 'Content Engine', icon: FileText },
    { id: 'roadmap', label: 'Roadmap', icon: Calendar },
    { id: 'tools', label: 'Tools', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              <motion.div
                whileHover={{ rotate: 10 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
              >
                <Rocket className="h-5 w-5" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  AI Creator Accelerator
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Your AI-Powered Business Partner</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* XP & Streak */}
              <div className="hidden sm:flex items-center gap-4 mr-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">{xp} XP</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">{streak} day streak</span>
                  </div>
                )}
              </div>
              
              <Badge variant="secondary" className="gap-1.5 py-1.5">
                <Clock className="h-3 w-3" />
                Week {currentWeek}/12
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5">
                <Users className="h-3 w-3" />
                20K
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-[65px] left-0 z-30 h-[calc(100vh-65px)] w-64 
          bg-white dark:bg-slate-900 border-r transform transition-transform duration-200
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2">
            {modules.map((module) => (
              <motion.button
                key={module.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveModule(module.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeModule === module.id
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                    : 'hover:bg-muted'
                }`}
              >
                <module.icon className="h-5 w-5" />
                <span className="font-medium">{module.label}</span>
              </motion.button>
            ))}
          </nav>
          
          {/* Progress Card */}
          <div className="p-4 mt-4">
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border-violet-200 dark:border-violet-800">
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground mb-2">Overall Progress</div>
                <Progress value={(currentWeek / 12) * 100} className="h-2 mb-2" />
                <div className="text-2xl font-bold text-violet-600">{Math.round((currentWeek / 12) * 100)}%</div>
                <div className="text-xs text-muted-foreground mt-1">Week {currentWeek} of 12 completed</div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-65px)] p-4 lg:p-6">
          <AnimatePresence mode="wait">
            {/* Dashboard */}
            {activeModule === 'dashboard' && (
              <motion.div
                key="dashboard"
                variants={stagger}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                {/* Welcome Card */}
                <motion.div variants={fadeIn}>
                  <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardContent className="pt-6 relative">
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div>
                          <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold mb-2"
                          >
                            Welcome Back, Creator! 👋
                          </motion.h2>
                          <p className="text-muted-foreground max-w-xl">
                            You're on Week {currentWeek} of your AI entrepreneurship journey. 
                            {currentWeek <= 2 && " Let's start by mastering AI tools and building your content engine."}
                            {currentWeek > 2 && currentWeek <= 5 && " Time to master prompt engineering and create compelling content."}
                            {currentWeek > 5 && currentWeek <= 8 && " You're now building real digital products!"}
                            {currentWeek > 8 && " Focus on monetizing your audience and scaling your business."}
                          </p>
                        </div>
                        <Button 
                          onClick={() => setActiveModule('chat')} 
                          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat with AI Mentor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Products Created', value: stats.productsCreated, icon: Wrench, color: 'emerald', change: '+1 this week' },
                    { label: 'Ideas Generated', value: stats.ideasGenerated, icon: Lightbulb, color: 'amber', change: 'Keep going!' },
                    { label: 'Content Pieces', value: stats.contentCreated, icon: FileText, color: 'blue', change: 'Great progress' },
                    { label: 'Progress', value: `${Math.round((currentWeek / 12) * 100)}%`, icon: Target, color: 'violet', change: `Week ${currentWeek}` },
                  ].map((stat, index) => (
                    <motion.div key={stat.label} variants={fadeIn}>
                      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{stat.label}</p>
                              <p className="text-3xl font-bold mt-1">{stat.value}</p>
                              <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
                            </div>
                            <div className={`h-12 w-12 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Generate Ideas', desc: 'Create 50 product ideas', icon: Lightbulb, color: 'from-amber-400 to-orange-500', action: () => setActiveModule('ideas') },
                    { title: 'Create Content', desc: 'Facebook posts & scripts', icon: FileText, color: 'from-blue-400 to-cyan-500', action: () => setActiveModule('content') },
                    { title: 'View Roadmap', desc: '12-week accelerator plan', icon: Calendar, color: 'from-violet-400 to-purple-500', action: () => setActiveModule('roadmap') },
                  ].map((action, index) => (
                    <motion.div key={action.title} variants={fadeIn}>
                      <Card 
                        className="cursor-pointer group hover:shadow-xl transition-all duration-300 overflow-hidden"
                        onClick={action.action}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                              <action.icon className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{action.title}</h3>
                              <p className="text-sm text-muted-foreground">{action.desc}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Current Mission */}
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="h-5 w-5 text-violet-600" />
                        Current Mission: Week {currentWeek}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${roadmap[currentWeek - 1]?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white`}>
                          {(() => {
                            const Icon = roadmap[currentWeek - 1]?.icon || Circle;
                            return <Icon className="h-8 w-8" />;
                          })()}
                        </div>
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2">{roadmap[currentWeek - 1]?.phase}</Badge>
                          <h4 className="text-xl font-semibold">{roadmap[currentWeek - 1]?.title}</h4>
                          <p className="text-muted-foreground">{roadmap[currentWeek - 1]?.description}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={() => setActiveModule('chat')} variant="outline">
                            Get Help
                          </Button>
                          <Button onClick={() => setActiveModule('roadmap')}>
                            View Full Roadmap
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* AI Mentor Chat */}
            {activeModule === 'chat' && (
              <motion.div
                key="chat"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-[calc(100vh-130px)]"
              >
                <EnhancedChat
                  currentWeek={currentWeek}
                  productsCreated={stats.productsCreated}
                  ideasGenerated={stats.ideasGenerated}
                />
              </motion.div>
            )}

            {/* AI Agents */}
            {activeModule === 'agents' && (
              <motion.div
                key="agents"
                variants={stagger}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <AutonomousAgentsPanel />
              </motion.div>
            )}

            {/* Ideas Engine */}
            {activeModule === 'ideas' && (
              <motion.div
                key="ideas"
                variants={stagger}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Product Ideas Engine
                      </CardTitle>
                      <CardDescription>
                        Generate AI-powered product ideas tailored to your audience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          placeholder="Enter niche (e.g., AI tools for entrepreneurs)"
                          value={ideaNiche}
                          onChange={(e) => setIdeaNiche(e.target.value)}
                          className="flex-1 text-base"
                        />
                        <Button 
                          onClick={generateIdeas} 
                          disabled={isLoading} 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        >
                          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                          Generate Ideas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="grid gap-4">
                  {ideas.length === 0 ? (
                    <motion.div variants={fadeIn}>
                      <Card className="border-dashed">
                        <CardContent className="pt-12 pb-12 text-center">
                          <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-lg font-medium mb-2">No ideas yet</p>
                          <p className="text-muted-foreground mb-4">Click "Generate Ideas" to get started!</p>
                          <Button onClick={generateIdeas} className="bg-amber-500 hover:bg-amber-600">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Your First Ideas
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    ideas.map((idea, index) => (
                      <motion.div key={idea.id} variants={fadeIn}>
                        <Card className="hover:shadow-lg transition-all duration-300 group">
                          <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold">{idea.title}</h3>
                                  <Badge variant="outline">{idea.category}</Badge>
                                  <div className="flex items-center gap-1 ml-auto lg:ml-0">
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                    <span className="font-semibold">{idea.potentialScore}</span>
                                  </div>
                                </div>
                                <p className="text-muted-foreground mb-3">{idea.problemSolved}</p>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="secondary">{idea.buildComplexity}</Badge>
                                  <Badge variant="secondary">{idea.monetizationModel}</Badge>
                                  <Badge variant="secondary">{idea.priceRange}</Badge>
                                </div>
                              </div>
                              <Button 
                                onClick={() => selectIdea(idea)} 
                                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Build This
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Content Engine */}
            {activeModule === 'content' && (
              <motion.div
                key="content"
                variants={stagger}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Content Engine
                      </CardTitle>
                      <CardDescription>
                        Generate Facebook content, video scripts, and engagement posts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          placeholder="Enter content topic"
                          value={contentTopic}
                          onChange={(e) => setContentTopic(e.target.value)}
                          className="flex-1 text-base"
                        />
                        <select
                          value={contentType}
                          onChange={(e) => setContentType(e.target.value)}
                          className="px-4 py-2 rounded-md border bg-background"
                        >
                          <option value="post">Facebook Post</option>
                          <option value="story">Story Idea</option>
                          <option value="video-script">Video Script</option>
                          <option value="engagement">Engagement Question</option>
                          <option value="promotion">Product Promotion</option>
                        </select>
                        <Button 
                          onClick={generateContent} 
                          disabled={isLoading} 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        >
                          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="grid gap-4">
                  {content.length === 0 ? (
                    <motion.div variants={fadeIn}>
                      <Card className="border-dashed">
                        <CardContent className="pt-12 pb-12 text-center">
                          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-lg font-medium mb-2">No content yet</p>
                          <p className="text-muted-foreground">Generate your first piece of content!</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    content.map((item) => (
                      <motion.div key={item.id} variants={fadeIn}>
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{item.type}</Badge>
                                <h3 className="font-semibold">{item.title}</h3>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.content)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg font-sans">
                              {item.content}
                            </pre>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Roadmap */}
            {activeModule === 'roadmap' && (
              <motion.div
                key="roadmap"
                variants={stagger}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-violet-500" />
                      12-Week AI Creator Accelerator
                    </CardTitle>
                    <CardDescription>
                      Your journey from AI beginner to AI-powered entrepreneur
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(currentWeek / 12) * 100} className="h-3 mb-6" />
                    <div className="space-y-3">
                      {roadmap.map((week, index) => {
                        const status = getProgressStatus(week.week);
                        const isCurrent = week.week === currentWeek;
                        const Icon = week.icon;
                        
                        return (
                          <motion.div key={week.week} variants={fadeIn}>
                            <Card className={`
                              transition-all duration-300 
                              ${isCurrent ? 'border-2 border-violet-500 shadow-lg shadow-violet-500/10' : ''} 
                              ${status === 'completed' ? 'opacity-75' : ''}
                            `}>
                              <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-4">
                                  <div className={`
                                    h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold
                                    bg-gradient-to-br ${week.color}
                                    ${status === 'completed' ? 'opacity-75' : ''}
                                  `}>
                                    {status === 'completed' ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs">{week.phase}</Badge>
                                      {isCurrent && <Badge className="bg-violet-500">Current</Badge>}
                                    </div>
                                    <h4 className="font-semibold truncate">{week.title}</h4>
                                    <p className="text-sm text-muted-foreground truncate">{week.description}</p>
                                  </div>
                                  {isCurrent && (
                                    <Button size="sm" onClick={() => setActiveModule('chat')} className="shrink-0">
                                      Start
                                      <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Tools */}
            {activeModule === 'tools' && (
              <motion.div
                key="tools"
                variants={stagger}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-cyan-500" />
                      Tool Discovery
                    </CardTitle>
                    <CardDescription>
                      Cutting-edge AI tools to accelerate your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { name: 'ChatGPT / Claude', category: 'AI Reasoning', use: 'Content creation, strategy, coding', icon: MessageSquare, color: 'from-violet-400 to-purple-500' },
                        { name: 'Midjourney / DALL-E', category: 'Image Generation', use: 'Product images, social media graphics', icon: Sparkles, color: 'from-pink-400 to-rose-500' },
                        { name: 'Runway / Pika', category: 'Video Generation', use: 'Marketing videos, content creation', icon: Play, color: 'from-blue-400 to-cyan-500' },
                        { name: 'Zapier / Make', category: 'Automation', use: 'Workflow automation, integrations', icon: Zap, color: 'from-amber-400 to-orange-500' },
                        { name: 'Cursor / v0', category: 'App Building', use: 'Build web apps and tools', icon: Wrench, color: 'from-emerald-400 to-teal-500' },
                        { name: 'Notion AI', category: 'Productivity', use: 'Documentation, planning', icon: BookOpen, color: 'from-gray-400 to-slate-500' },
                      ].map((tool) => (
                        <Card key={tool.name} className="hover:shadow-md transition-all duration-300 group">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <tool.icon className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{tool.name}</h3>
                                <Badge variant="outline" className="mb-2">{tool.category}</Badge>
                                <p className="text-sm text-muted-foreground">{tool.use}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
        achievement={celebrationText}
      />

      {/* Footer */}
      <footer className="mt-auto border-t bg-white/80 backdrop-blur-md dark:bg-slate-900/80 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>AI Creator Business Accelerator — Your AI-Powered Business Partner</p>
        </div>
      </footer>
    </div>
  );
}
