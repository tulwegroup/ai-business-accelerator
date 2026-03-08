'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Send, User, Loader2, ChevronDown,
  Rocket, Wrench, BookOpen, Search, FileText,
  Copy, Check, RefreshCw, ThumbsUp, Lightbulb,
  Sparkles, Bot, Menu, X, Maximize2, Minimize2,
  MessageCircle, Zap, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AGENT_PERSONAS, getQuickSuggestions, type AgentType } from '@/lib/agent-types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agent?: AgentType;
}

interface EnhancedChatProps {
  currentWeek?: number;
  productsCreated?: number;
  ideasGenerated?: number;
}

const AGENT_ICONS: Record<AgentType, typeof Rocket> = {
  mentor: Rocket,
  builder: Wrench,
  educator: BookOpen,
  researcher: Search,
  content: FileText
};

// Typing indicator component
function TypingIndicator({ agentName }: { agentName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
        <Bot className="w-5 h-5" />
      </div>
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm border border-violet-100 dark:border-violet-900">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                className="w-2 h-2 rounded-full bg-violet-500"
              />
            ))}
          </div>
          <span className="text-sm text-violet-600 dark:text-violet-300 font-medium">
            {agentName} is thinking...
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function EnhancedChat({
  currentWeek = 1,
  productsCreated = 0,
  ideasGenerated = 0
}: EnhancedChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('mentor');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to bottom with animation
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Get context-aware suggestions
  const suggestions = getQuickSuggestions(
    messages.length === 0 ? 'start' : 'progress',
    selectedAgent
  );

  // Send message via API
  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Scroll immediately after adding user message
    setTimeout(scrollToBottom, 50);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          agentType: selectedAgent,
          context: {
            currentWeek,
            productsCreated,
            ideasGenerated
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          agent: selectedAgent
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Copy message to clipboard
  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    toast.success('Chat cleared');
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentAgent = AGENT_PERSONAS[selectedAgent];

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              key={selectedAgent}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg border border-white/30"
            >
              {currentAgent.avatar}
            </motion.div>
            <div>
              <h2 className="font-bold text-xl tracking-tight">{currentAgent.name}</h2>
              <p className="text-sm text-white/80 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                {currentAgent.specialty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white hover:bg-white/20 rounded-lg"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAgentSelector(!showAgentSelector)}
              className="text-white hover:bg-white/20 rounded-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Switch Agent
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showAgentSelector ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Agent Selector Dropdown */}
        <AnimatePresence>
          {showAgentSelector && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(AGENT_PERSONAS) as AgentType[]).map((agentKey) => {
                  const agent = AGENT_PERSONAS[agentKey];
                  const isSelected = selectedAgent === agentKey;

                  return (
                    <motion.button
                      key={agentKey}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedAgent(agentKey);
                        setShowAgentSelector(false);
                        inputRef.current?.focus();
                      }}
                      className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all duration-200 ${
                        isSelected
                          ? 'bg-white text-violet-600 shadow-lg'
                          : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
                      }`}
                    >
                      <span className="text-2xl">{agent.avatar}</span>
                      <span className="text-xs font-semibold truncate w-full text-center">{agent.name.split(' ')[0]}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-6 scroll-smooth"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Welcome Message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-6"
            >
              {currentAgent.avatar}
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Hi! I'm {currentAgent.name.split(' ')[0]}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
              {currentAgent.description}
            </p>

            {/* Stats Cards */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="py-2 px-4 text-sm gap-2">
                <Target className="w-4 h-4 text-violet-500" />
                Week {currentWeek}
              </Badge>
              <Badge variant="secondary" className="py-2 px-4 text-sm gap-2">
                <Wrench className="w-4 h-4 text-emerald-500" />
                {productsCreated} Products
              </Badge>
              <Badge variant="secondary" className="py-2 px-4 text-sm gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                {ideasGenerated} Ideas
              </Badge>
            </div>

            {/* Quick Start Suggestions */}
            <div className="w-full max-w-xl space-y-3">
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2 justify-center">
                <Zap className="w-4 h-4 text-amber-500" />
                Try asking:
              </p>
              {suggestions.slice(0, 4).map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  onClick={() => sendMessage(suggestion)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-800 dark:to-violet-950/50 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 text-left transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 shadow-sm hover:shadow-md group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-5 h-5 text-violet-600 dark:text-violet-300" />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                    : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <span className="text-lg">{message.agent && AGENT_PERSONAS[message.agent]?.avatar}</span>
                  )}
                </div>

                {/* Message Content */}
                <div className={`relative group ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-3xl rounded-tr-lg shadow-lg shadow-violet-500/20'
                    : 'bg-gradient-to-br from-slate-50 to-violet-50 dark:from-slate-800 dark:to-violet-950/50 rounded-3xl rounded-tl-lg border border-slate-200 dark:border-slate-700 shadow-md'
                } px-5 py-4`}>
                  {/* Markdown Content */}
                  <div className={`prose prose-sm max-w-none ${
                    message.role === 'user' ? 'prose-invert' : 'dark:prose-invert prose-slate'
                  }`}>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 pl-4 list-disc">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 pl-4 list-decimal">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        code: ({ children }) => (
                          <code className={`px-1.5 py-0.5 rounded text-sm ${
                            message.role === 'user' ? 'bg-white/20' : 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300'
                          }`}>
                            {children}
                          </code>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className={`border-l-4 pl-3 italic ${
                            message.role === 'user' ? 'border-white/50' : 'border-violet-400'
                          }`}>
                            {children}
                          </blockquote>
                        )
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>

                  {/* Actions */}
                  <div className={`flex items-center gap-3 mt-3 pt-3 border-t ${
                    message.role === 'user' ? 'border-white/20' : 'border-slate-200 dark:border-slate-700'
                  }`}>
                    <span className="text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {message.role === 'assistant' && (
                      <>
                        <button
                          onClick={() => copyMessage(message.content, message.id)}
                          className="ml-auto p-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400 hover:text-violet-500" />
                          )}
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors" title="Helpful">
                          <ThumbsUp className="w-4 h-4 text-slate-400 hover:text-violet-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <TypingIndicator agentName={currentAgent.name.split(' ')[0]} />
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-4">
        {/* Contextual Suggestions */}
        {messages.length > 0 && !isLoading && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.slice(0, 3).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setInput(suggestion)}
                className="text-xs px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors border border-violet-200 dark:border-violet-800 truncate max-w-[200px]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Ask ${currentAgent.name.split(' ')[0]} anything...`}
            className="flex-1 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-500 transition-colors text-base py-6 px-4"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl px-8 shadow-lg shadow-violet-500/25 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs gap-1.5 py-1">
              <MessageCircle className="w-3 h-3" />
              {messages.length} messages
            </Badge>
            <span className="hidden sm:inline">Press Enter to send</span>
          </div>

          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-xs hover:text-violet-600">
              <RefreshCw className="w-3 h-3 mr-1" />
              Clear chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
