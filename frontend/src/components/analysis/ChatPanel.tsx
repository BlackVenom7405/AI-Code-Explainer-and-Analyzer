import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { sendChatMessage } from '../../services/api';
import { Send, Loader2, Bot, User, Trash2 } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface ChatPanelProps {
  code: string;
  language: string;
  analysisContext?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ code, language, analysisContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I've loaded your ${language.toUpperCase()} code into context. Ask me anything about its logic, complexity, edge cases, or potential optimizations!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await sendChatMessage(
        code,
        language,
        userMessage,
        analysisContext,
        updatedMessages
      );

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.reply }
      ]);
    } catch (err: any) {
      toast({
        title: 'Chat Failed',
        message: err.message || 'Could not reach AI assistant',
        type: 'error'
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, I encountered an error answering your question: ${err.message || 'Please try again.'}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation cleared. Ready for your questions!`
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Shell Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b border-border/80">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">
            Contextual Code Assistant (Gemini)
          </h4>
        </div>
        <button
          onClick={handleClear}
          className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-primary'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted/60 text-foreground border border-border/60 rounded-tl-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-muted text-primary flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/60 text-muted-foreground rounded-tl-sm border border-border/60 flex items-center gap-2 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleSend} className="p-3 bg-muted/20 border-t border-border/80 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this code..."
          disabled={loading}
          className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all flex items-center justify-center shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
