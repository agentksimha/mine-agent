import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Download } from 'lucide-react';
 import axios from "axios";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your Mine Safety Assistant. Ask safety queries, incident reports, or generate audit reports.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    text: input,
    sender: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);

  const query = input;
  setInput("");

  try {
    // ✅ Axios POST request to /query
    const res = await axios.post(
      "http://localhost:8000/query",
      { query },
      { responseType: "blob" } // IMPORTANT: Allows PDF detection
    );

    const contentType = res.headers["content-type"];

    // ✅ If backend sent a PDF
    if (contentType && contentType.includes("application/pdf")) {
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "✅ Audit report is ready. Click below to download.",
        sender: "bot",
        timestamp: new Date(),
        pdfUrl: pdfUrl, // ✅ store PDF link
      };

      setMessages((prev) => [...prev, botMessage]);
      return;
    }

    // ✅ Otherwise treat it like text/JSON
    const textData = await new Response(res.data).text();
    let parsed;
    try {
      parsed = JSON.parse(textData);
    } catch {
      parsed = { response: textData };
    }

    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: parsed.response || "Sorry, I couldn't understand that.",
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: "⚠️ Server error. Please check backend connection.",
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  }
};


  // ✅ Manual Audit Report Button
  const handleGenerateReport = async () => {
    try {
      const res = await fetch("YOUR_AUDIT_REPORT_API_URL", { method: "GET" });

      const contentType = res.headers.get("Content-Type");

      if (contentType && contentType.includes("application/pdf")) {
        const pdfBlob = await res.blob();
        downloadPDF(pdfBlob);
        
        const botMessage = {
          id: Date.now().toString(),
          text: '✅ Audit report has been generated and downloaded successfully.',
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        return;
      }

      // if plain text
      const report = await res.text();
      const blob = new Blob([report], { type: 'text/plain' });
      downloadPDF(blob);

      const confirmMessage = {
        id: Date.now().toString(),
        text: '✅ Audit report has been generated and downloaded successfully.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, confirmMessage]);

    } catch (error) {
      const errorMessage = {
        id: Date.now().toString(),
        text: "⚠️ Failed to generate audit report. Check backend API.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const downloadPDF = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mine-safety-audit-report-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)]">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Mine Officer Assistant</h2>
        <p className="text-gray-600">AI-powered support for safety queries and reporting</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100%-8rem)]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4">
         
          

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask safety queries, incidents, stats..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>

      <div className={`flex-1 max-w-2xl ${isBot ? '' : 'flex justify-end'}`}>
        <div
          className={`rounded-lg px-4 py-3 ${
            isBot ? 'bg-gray-100 text-gray-900' : 'bg-blue-600 text-white'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>

          {/* ✅ If a PDF exists, show download button inside chat */}
          {message.pdfUrl && (
            <a
              href={message.pdfUrl}
              download={`audit-report-${Date.now()}.pdf`}
              className="mt-2 inline-flex items-center space-x-2 text-blue-600 underline text-sm"
            >
              <Download size={14} />
              <span>Download Audit Report</span>
            </a>
          )}

          <span
            className={`text-xs mt-1 block ${
              isBot ? 'text-gray-500' : 'text-blue-100'
            }`}
          >
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
