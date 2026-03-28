import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getChatResponse } from '../services/geminiService';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
  isReport?: boolean;
}

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'System initialized. I have full access to current biometric sensor data, air quality readings from the South Shaft, and the last 24 hours of incident reports. How can I assist your safety inspection today?',
      timestamp: '09:00 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await getChatResponse(input, history);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReport: response.includes('Analysis') || response.includes('Report')
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] pt-8">
      {/* Header Info */}
      <div className="mb-8 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">

          <div>
            <h1 className="font-headline text-xl font-semibold tracking-tight">Digital Mine Safety Officer</h1>

          </div>
        </div>

      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-grow chat-scroll-area overflow-y-auto space-y-8 px-6 pb-32">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'max-w-[85%] ml-auto flex-row-reverse' : 'max-w-[85%]'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${msg.role === 'ai'
                  ? 'bg-surface-container-highest border-outline-variant/20 text-tertiary'
                  : 'bg-primary/10 border-primary/20 text-primary'
                }`}>

              </div>
              <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`p-5 rounded-2xl shadow-sm text-left border ${msg.role === 'ai'
                    ? 'bg-surface-container-low border-outline-variant/5 rounded-tl-none'
                    : 'bg-primary/5 border-primary/10 rounded-tr-none'
                  }`}>
                  {msg.isReport ? (
                    <div className="space-y-4">
                      <h3 className="font-headline font-bold text-lg text-tertiary">Zone B Air Quality Analysis</h3>
                      <p className="text-sm text-slate-300">Analysis indicates a sustained increase in PM10 particulates near the Conveyor 04 junction.</p>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                          <AlertCircle className="text-primary w-4 h-4 mt-1" />
                          <span><strong>Peak recorded:</strong> 2.4mg/m³ at 07:15 AM (Exceeds Tier 1 threshold).</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="text-tertiary w-4 h-4 mt-1" />
                          <span><strong>Current status:</strong> 1.1mg/m³ (Falling after automated suppression activation).</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Info className="text-slate-500 w-4 h-4 mt-1" />
                          <span><strong>Recommendation:</strong> Schedule nozzle maintenance for the West spray bar within 12 hours.</span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-on-surface leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                <span className="text-[10px] font-label text-slate-600 px-1 uppercase tracking-wider">
                  {msg.role === 'ai' ? 'SENTINEL AI' : 'YOU'} • {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-4 max-w-[85%]">
           
            <div className="bg-surface-container-low px-4 py-3 rounded-2xl rounded-tl-none border border-outline-variant/5 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce" />
              </div>
              <span className="text-xs font-label text-slate-500 uppercase tracking-widest ml-2">AI is processing logs...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full bg-surface/80 backdrop-blur-xl border-t border-outline-variant/10 left-0">
        <div className="max-w-5xl mx-auto px-6 py-6 w-full">
          <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
            {['Latest safety report for Zone B', 'Summarize recent near-misses', 'Compliance checklist for MSHA Section 3'].map((query) => (
              <button
                key={query}
                onClick={() => setInput(query)}
                className="px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-bright text-xs font-medium text-on-surface border border-outline-variant/20 transition-all hover:border-tertiary/50"
              >
                {query}
              </button>
            ))}
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-tertiary/5 rounded-2xl blur-xl transition-opacity opacity-0 group-focus-within:opacity-100" />
            <div className="relative gap-5 flex items-center bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-2 group-focus-within:border-tertiary/50 transition-all">
              <button className="p-3 text-slate-500 hover:text-tertiary transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface text-sm py-3 px-2 placeholder:text-slate-600"
                placeholder="Inquire about mine safety protocols or real-time data..."
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary p-3 rounded-xl flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};
