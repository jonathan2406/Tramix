"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";

type Message = { role: "user" | "assistant", content: string };

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "¡Hola! Soy el asistente virtual de TRAMIX. ¿En qué te puedo ayudar hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      const assistantMsg = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: "assistant", content: assistantMsg }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `❌ Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante lado inferior izquierdo */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 bg-brand-primary text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        title="Asistente TRAMIX"
      >
        <MessageSquare className="w-7 h-7" />
      </button>

      {/* Ventana de Chat */}
      <div className={`fixed bottom-6 left-6 z-50 w-80 md:w-96 h-[600px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-left ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-20 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-brand-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Bot className="w-6 h-6" />
            <h3 className="font-bold">Asistente TRAMIX</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 min-h-[50%]">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-brand-secondary text-brand-primary-dark' : 'bg-brand-primary/10 text-brand-primary'}`}>
                {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-brand-secondary text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex gap-2 max-w-[85%]">
               <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-primary/10 text-brand-primary">
                 <Bot className="w-5 h-5" />
               </div>
               <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" /> Pensando...
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-brand-primary text-white p-2.5 rounded-xl hover:bg-brand-primary-dark transition disabled:opacity-50 disabled:bg-gray-300 min-w-[44px] flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
