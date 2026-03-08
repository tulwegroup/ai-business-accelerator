'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Bot, Play, CheckCircle2, Circle, Loader2, ChevronDown,
  Wrench, BookOpen, Search, FileText, Rocket, Target,
  Clock, ArrowRight, Sparkles, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AgentTask {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  agentType: string;
}

interface TaskStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  output?: string;
}

const AGENT_ICONS: Record<string, typeof Bot> = {
  builder: Wrench,
  educator: BookOpen,
  researcher: Search,
  content: FileText,
  mentor: Rocket
};

export default function AutonomousAgentsPanel() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<TaskStep[]>([]);
  const [finalOutput, setFinalOutput] = useState<string>('');
  const [params, setParams] = useState<Record<string, string>>({});
  const [showOutput, setShowOutput] = useState(false);

  // Fetch available tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/agents');
        const data = await res.json();
        if (data.success) {
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Execute a task
  const executeTask = async (task: AgentTask) => {
    setIsExecuting(true);
    setCurrentSteps([]);
    setFinalOutput('');
    setShowOutput(true);

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: task.id,
          params: params
        })
      });

      const data = await res.json();

      if (data.success) {
        // Animate the steps appearing
        for (let i = 0; i < data.steps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setCurrentSteps(data.steps.slice(0, i + 1));
        }

        setFinalOutput(data.finalOutput);
        toast.success(`${task.name} completed successfully!`);
      } else {
        toast.error('Task execution failed');
      }
    } catch (error) {
      console.error('Task execution error:', error);
      toast.error('Failed to execute task');
    }

    setIsExecuting(false);
  };

  // Get icon for agent type
  const getAgentIcon = (agentType: string) => {
    const Icon = AGENT_ICONS[agentType] || Bot;
    return <Icon className="w-5 h-5" />;
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'in-progress':
        return <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />;
      case 'failed':
        return <Circle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border-violet-200 dark:border-violet-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Autonomous AI Agents
              </CardTitle>
              <CardDescription>
                AI agents that can complete multi-step tasks for you automatically
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Available Tasks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedTask?.id === task.id
                  ? 'ring-2 ring-violet-500 shadow-lg'
                  : ''
              }`}
              onClick={() => {
                setSelectedTask(task);
                setShowOutput(false);
                setCurrentSteps([]);
              }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 flex items-center justify-center text-violet-600 dark:text-violet-300">
                    {getAgentIcon(task.agentType)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{task.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.estimatedTime}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {task.agentType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Task Execution Panel */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
                      {getAgentIcon(selectedTask.agentType)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedTask.name}</CardTitle>
                      <CardDescription>{selectedTask.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => executeTask(selectedTask)}
                    disabled={isExecuting}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Agent
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              {/* Parameters (optional) */}
              <CardContent className="border-t">
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Additional Context (Optional)</label>
                  <Input
                    placeholder="Enter any specific requirements or context..."
                    value={params.context || ''}
                    onChange={(e) => setParams({ ...params, context: e.target.value })}
                    className="max-w-md"
                  />
                </div>

                {/* Progress Steps */}
                {currentSteps.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-violet-500" />
                      Progress
                    </h4>
                    <div className="space-y-3">
                      {currentSteps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="mt-0.5">
                            {getStatusIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{step.title}</div>
                            <div className="text-sm text-muted-foreground">{step.description}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Output */}
                {finalOutput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Agent Output
                    </h4>
                    <div className="prose prose-sm max-w-none dark:prose-invert p-4 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border border-violet-200 dark:border-violet-800">
                      <ReactMarkdown>{finalOutput}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
