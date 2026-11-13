import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Edit3, Loader2, Menu, MessageSquare, Plus, Send, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChatSessionSummary,
  createChatSession,
  deleteChatSession,
  getChatResponse,
  listChatSessions,
  loadChatSession,
  renameChatSession,
} from '../services/geminiService';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
}

const welcomeMessage = (): Message => ({
  id: 'welcome',
  role: 'ai',
  content: 'Welcome to your Digital Mine Safety Officer. Ask about mine safety records, incidents, precautions, trends, or regulations.',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

const timeLabel = (value?: string) => {
  if (!value) return '';
  const date = new Date(value.endsWith('Z') ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const errorText = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';

const renderInlineMarkdown = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const matches = [
      { type: 'bold', match: remaining.match(/\*\*(.+?)\*\*/) },
      { type: 'italic', match: remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/) },
      { type: 'code', match: remaining.match(/`([^`]+?)`/) },
    ].filter(item => item.match?.index !== undefined).sort((a, b) => a.match!.index! - b.match!.index!);
    if (!matches.length) {
      parts.push(remaining);
      break;
    }
    const { type, match } = matches[0];
    const index = match!.index!;
    if (index > 0) parts.push(remaining.substring(0, index));
    if (type === 'bold') parts.push(<strong key={key++} className="font-semibold text-white">{match![1]}</strong>);
    if (type === 'italic') parts.push(<em key={key++} className="italic text-slate-300">{match![1]}</em>);
    if (type === 'code') parts.push(<code key={key++} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-amber-300">{match![1]}</code>);
    remaining = remaining.substring(index + match![0].length);
  }
  return parts;
};

const renderFormattedContent = (content: string): React.ReactNode => content.split(/\n\n+/).map((block, blockIndex) => {
  const trimmed = block.trim();
  if (!trimmed) return null;
  const lines = trimmed.split('\n');
  const numbered = lines.every(line => /^\s*\d+[.)]\s+/.test(line.trim()) || !line.trim());
  const bullets = lines.every(line => /^\s*[-•*]\s+/.test(line.trim()) || !line.trim());
  if (numbered || bullets) {
    const List = numbered ? 'ol' : 'ul';
    return (
      <List key={blockIndex} className={`${numbered ? 'list-decimal' : 'list-disc'} my-3 space-y-2 pl-5`}>
        {lines.filter(line => line.trim()).map((line, index) => (
          <li key={index} className="text-[14px] leading-relaxed text-slate-200">
            {renderInlineMarkdown(line.replace(/^\s*(\d+[.)]|[-•*])\s+/, ''))}
          </li>
        ))}
      </List>
    );
  }
  return <p key={blockIndex} className="my-2 whitespace-pre-line text-[14px] leading-[1.8] text-slate-200">{renderInlineMarkdown(trimmed)}</p>;
});

export const ChatScreen: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [input, setInput] = useState('');
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshSessions = useCallback(async () => {
    const items = await listChatSessions();
    setSessions(items);
    return items;
  }, []);

  const openSession = useCallback(async (sessionId: string) => {
    setError('');
    setLoadingConversation(true);
    try {
      const session = await loadChatSession(sessionId);
      setActiveSessionId(session.id);
      setMessages(session.messages.length ? session.messages.map((message, index) => ({
        id: `${session.id}-${index}`,
        role: message.role === 'assistant' ? 'ai' : 'user',
        content: message.content,
        timestamp: timeLabel(message.created_at),
      })) : [welcomeMessage()]);
      setSidebarOpen(false);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoadingConversation(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const items = await refreshSessions();
        if (items[0]) await openSession(items[0].id);
      } catch (err) {
        setError(errorText(err));
      } finally {
        setLoadingSessions(false);
      }
    };
    initialize();
  }, [openSession, refreshSessions]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const newChat = async () => {
    setError('');
    try {
      const created = await createChatSession();
      setActiveSessionId(created.session_id);
      setMessages([welcomeMessage()]);
      await refreshSessions();
      setSidebarOpen(false);
    } catch (err) {
      setError(errorText(err));
    }
  };

  const saveRename = async (sessionId: string) => {
    const title = renameValue.trim();
    if (!title) return;
    try {
      await renameChatSession(sessionId, title);
      setRenamingId(null);
      await refreshSessions();
    } catch (err) {
      setError(errorText(err));
    }
  };

  const removeSession = async (sessionId: string) => {
    if (!window.confirm('Delete this conversation permanently?')) return;
    try {
      await deleteChatSession(sessionId);
      const items = await refreshSessions();
      if (activeSessionId === sessionId) {
        if (items[0]) await openSession(items[0].id);
        else {
          setActiveSessionId(null);
          setMessages([welcomeMessage()]);
        }
      }
    } catch (err) {
      setError(errorText(err));
    }
  };

  const handleSend = async () => {
    const query = input.trim();
    if (!query || isTyping) return;
    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: query, timestamp: timeLabel(new Date().toISOString()) };
    setMessages(previous => [...previous.filter(message => message.id !== 'welcome'), userMessage]);
    setInput('');
    setError('');
    setIsTyping(true);
    try {
      const data = await getChatResponse(query, activeSessionId);
      setActiveSessionId(data.session_id);
      setMessages(previous => [...previous, {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: data.response,
        timestamp: timeLabel(new Date().toISOString()),
      }]);
      await refreshSessions();
    } catch (err) {
      setError(errorText(err));
      setMessages(previous => previous.filter(message => message.id !== userMessage.id));
      setInput(query);
    } finally {
      setIsTyping(false);
    }
  };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-[#0d0d0f]">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <h2 className="text-sm font-semibold text-white">Conversations</h2>
        <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 lg:hidden" aria-label="Close conversations"><X className="h-5 w-5" /></button>
      </div>
      <div className="p-3">
        <button onClick={newChat} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500">
          <Plus className="h-4 w-4" /> New conversation
        </button>
      </div>
      <div className="chat-scroll-area flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        {loadingSessions && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-amber-400" /></div>}
        {!loadingSessions && !sessions.length && <p className="px-4 py-6 text-center text-xs text-slate-600">No saved conversations yet.</p>}
        {sessions.map(session => (
          <div key={session.id} className={`group rounded-xl border p-2 transition ${activeSessionId === session.id ? 'border-amber-500/30 bg-amber-500/10' : 'border-transparent hover:bg-white/5'}`}>
            {renamingId === session.id ? (
              <div className="flex items-center gap-1">
                <input autoFocus value={renameValue} onChange={event => setRenameValue(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') saveRename(session.id); if (event.key === 'Escape') setRenamingId(null); }} className="min-w-0 flex-1 rounded-lg border border-amber-500/30 bg-black/40 px-2 py-1.5 text-xs outline-none" />
                <button onClick={() => saveRename(session.id)} className="p-1.5 text-emerald-400" aria-label="Save name"><Check className="h-4 w-4" /></button>
                <button onClick={() => setRenamingId(null)} className="p-1.5 text-slate-400" aria-label="Cancel rename"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <button onClick={() => openSession(session.id)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm text-slate-200">{session.title}</p>
                  <p className="mt-1 text-[10px] text-slate-600">{session.message_count} messages</p>
                </button>
                <div className="flex opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">
                  <button onClick={() => { setRenamingId(session.id); setRenameValue(session.title); }} className="p-1.5 text-slate-500 hover:text-amber-300" aria-label="Rename conversation"><Edit3 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => removeSession(session.id)} className="p-1.5 text-slate-500 hover:text-red-300" aria-label="Delete conversation"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );

  return (
    <div className="relative -mx-4 flex h-[calc(100vh-80px)] overflow-hidden md:-mx-10 lg:-mx-20 xl:-mx-40">
      <div className="hidden lg:block">{sidebar}</div>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="fixed inset-0 z-50 flex bg-black/70 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)}>
            <motion.div initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }} transition={{ type: 'tween' }} onClick={event => event.stopPropagation()}>{sidebar}</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="flex min-w-0 flex-1 flex-col px-4 sm:px-6">
        <header className="flex flex-shrink-0 items-center gap-3 border-b border-white/5 py-4">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden" aria-label="Open conversations"><Menu className="h-5 w-5" /></button>
          <MessageSquare className="h-5 w-5 text-amber-400" />
          <h1 className="font-headline text-lg font-semibold text-white">Digital Mine Safety Officer</h1>
        </header>

        {error && <div role="alert" className="mt-3 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error"><X className="h-4 w-4" /></button></div>}

        <div ref={scrollRef} className="chat-scroll-area flex-1 space-y-4 overflow-y-auto py-5 pr-2">
          {loadingConversation ? <div className="flex h-full items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-amber-400" /></div> : (
            <AnimatePresence initial={false}>
              {messages.map(message => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[88%] md:max-w-[75%]">
                    <div className={`rounded-2xl px-5 py-4 ${message.role === 'user' ? 'rounded-br-md bg-amber-600/90 text-white' : 'rounded-bl-md border border-white/[0.06] bg-[#1A1A1F] text-slate-200'}`}>
                      {message.role === 'ai' ? renderFormattedContent(message.content) : <p className="text-[14px] leading-relaxed">{message.content}</p>}
                    </div>
                    <p className={`mt-1 px-1 text-[10px] uppercase tracking-wider text-slate-600 ${message.role === 'user' ? 'text-right' : ''}`}>{message.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {isTyping && <div className="flex justify-start"><div className="flex items-center gap-3 rounded-2xl rounded-bl-md border border-white/[0.06] bg-[#1A1A1F] px-5 py-4"><Loader2 className="h-4 w-4 animate-spin text-amber-400" /><span className="text-xs text-slate-500">Analyzing...</span></div></div>}
        </div>

        <div className="flex-shrink-0 pb-5 pt-3">
          {!messages.some(message => message.role === 'user') && <div className="mb-3 flex flex-wrap justify-center gap-2">{['Methane accidents in 2021', 'Summarize recent incidents', 'Safety recommendations for underground mines'].map(query => <button key={query} onClick={() => setInput(query)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-400 transition hover:border-amber-500/30 hover:text-white">{query}</button>)}</div>}
          <div className="flex items-center rounded-xl border border-white/10 bg-[#141417] transition focus-within:border-amber-500/40">
            <input value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) handleSend(); }} disabled={isTyping || loadingConversation} className="flex-1 bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-slate-600" placeholder="Ask a follow-up or start a new safety query..." />
            <button onClick={handleSend} disabled={!input.trim() || isTyping || loadingConversation} className="m-1.5 rounded-lg bg-amber-600 p-3 text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500" aria-label="Send message">{isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}</button>
          </div>
        </div>
      </section>
    </div>
  );
};
