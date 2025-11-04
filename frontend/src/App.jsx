import { useState, useRef, useEffect } from 'react';
import { Send, Shield, AlertTriangle } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content:
        "Hello! I'm your Digital Mine Safety Officer. I can help you analyze mine safety data, generate reports, and provide insights on incidents and compliance. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateMockResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-emerald-500/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/30">
              <Shield className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Digital Mine Safety Officer
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                AI-Powered Safety Analytics & Compliance Assistant
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white ml-auto'
                    : 'bg-slate-800/80 backdrop-blur-sm text-slate-100 border border-slate-700/50'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                      Safety Officer
                    </span>
                  </div>
                )}
                <div className="prose prose-sm prose-invert max-w-none">
                  <MessageContent content={message.content} />
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-5 py-3.5 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                    Safety Officer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                  <span className="text-sm text-slate-400">Analyzing safety data...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-slate-400">
              Example: "Show methane explosion incidents in 2022" or "Generate safety audit report"
            </span>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about mine safety incidents, compliance, or request reports..."
              className="flex-1 bg-slate-900/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function MessageContent({ content }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h3 key={index} className="text-base font-bold text-white mt-3 mb-2">
              {line.replace(/\*\*/g, '')}
            </h3>
          );
        }

        if (line.startsWith('| ') || line.startsWith('|---')) {
          return null;
        }

        if (line.match(/^[•✓⚠]/)) {
          const icon = line.charAt(0);
          const text = line.slice(1).trim();
          const colorClass =
            icon === '✓'
              ? 'text-emerald-400'
              : icon === '⚠'
              ? 'text-yellow-400'
              : 'text-slate-300';

          return (
            <div key={index} className="flex items-start gap-2 py-1">
              <span className={`${colorClass} font-bold mt-0.5`}>{icon}</span>
              <span className="text-slate-200 text-sm flex-1">{text}</span>
            </div>
          );
        }

        if (line.match(/^\d+\./)) {
          return (
            <div key={index} className="flex items-start gap-2 py-1">
              <span className="text-emerald-400 font-semibold text-sm">
                {line.match(/^\d+\./)?.[0]}
              </span>
              <span className="text-slate-200 text-sm flex-1">
                {line.replace(/^\d+\.\s*/, '')}
              </span>
            </div>
          );
        }

        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }

        return (
          <p key={index} className="text-slate-200 text-sm leading-relaxed">
            {line}
          </p>
        );
      })}

      {content.includes('| ') && (
        <div className="overflow-x-auto my-3">
          <table className="min-w-full bg-slate-900/30 rounded-lg overflow-hidden border border-slate-700/50">
            <thead className="bg-slate-700/50">
              <tr>
                {content
                  .split('\n')
                  .find((l) => l.startsWith('| '))
                  ?.split('|')
                  .filter((c) => c.trim())
                  .map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 text-left text-xs font-semibold text-emerald-400 uppercase tracking-wide"
                    >
                      {header.trim()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {content
                .split('\n')
                .filter((l) => l.startsWith('| ') && !l.includes('---'))
                .slice(1)
                .map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                  >
                    {row
                      .split('|')
                      .filter((c) => c.trim())
                      .map((cell, j) => (
                        <td key={j} className="px-4 py-2.5 text-sm text-slate-300">
                          {cell.trim()}
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
