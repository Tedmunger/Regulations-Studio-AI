
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { ResearchMessage, performRegulatoryResearch } from '../services/aiService';

const ResearchAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ResearchMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hello. I am your Forefront Regulatory Assistant. You can ask me complex questions about SEC filings, FDA guidance, EPA mandates, or NIST frameworks. For example: "What are the specific filing conditions for Schedule II under Rule 5-04?"' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    try {
      const result = await performRegulatoryResearch(userQuery, messages);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.text,
        sources: result.sources 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I encountered an error while accessing the regulatory database. Please try again shortly." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-slate-800">Regulatory AI Research</h3>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded border border-slate-200">
          Powered by Gemini 3 Pro
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div className={`max-w-[85%] space-y-3`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                {msg.content}
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Grounded Sources
                  </p>
                  <ul className="space-y-1.5">
                    {msg.sources.map((source, sIdx) => (
                      <li key={sIdx}>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 truncate"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-blue-300 animate-spin" />
            </div>
            <div className="h-10 bg-slate-100 rounded-2xl w-48 border border-slate-200"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
        <div className="relative flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about Rule 5-04 exclusions or FDA guidance..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResearchAssistant;
