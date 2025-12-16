import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { streamChatWithDocument } from '../services/geminiService';

interface SidebarProps {
    documentContent: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ documentContent }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { 
            id: '1', 
            role: 'model', 
            text: 'I am Muse. I have read your draft. How shall we refine it today?', 
            timestamp: Date.now() 
        }
    ]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isStreaming]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [input]);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        const userText = input.trim();
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: userText,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        setIsStreaming(true);

        const aiMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: aiMsgId,
            role: 'model',
            text: '',
            timestamp: Date.now()
        }]);

        try {
            const history = messages.map(m => ({ role: m.role, text: m.text }));
            const stream = streamChatWithDocument(history, userText, documentContent);
            
            let fullResponse = "";
            
            for await (const chunk of stream) {
                fullResponse += chunk;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMsgId ? { ...msg, text: fullResponse } : msg
                ));
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => prev.map(msg => 
                msg.id === aiMsgId ? { ...msg, text: "I seem to be disconnected. Please check your key." } : msg
            ));
        } finally {
            setIsStreaming(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-muse-50 border-l border-muse-200 shadow-xl z-20">
            {/* Header */}
            <div className="px-6 py-6 border-b border-muse-200 bg-muse-50 flex items-center justify-between">
                <div>
                    <h2 className="font-serif text-xl italic text-muse-900">Muse</h2>
                    <p className="text-xs text-muse-500 font-sans mt-1">AI Thinking Partner</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8" ref={scrollRef}>
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <span className="text-[10px] uppercase tracking-widest text-muse-400 mb-2">
                            {msg.role === 'user' ? 'You' : 'Muse'}
                        </span>
                        <div 
                            className={`max-w-[90%] text-sm leading-7 font-sans ${
                                msg.role === 'user' 
                                ? 'text-muse-900 bg-white border border-muse-200 px-4 py-3 rounded-lg shadow-sm' 
                                : 'text-muse-800'
                            }`}
                        >
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    </div>
                ))}
                
                {isStreaming && messages[messages.length - 1]?.text === '' && (
                    <div className="flex items-center space-x-1 px-1">
                         <div className="w-1 h-1 bg-accent rounded-full animate-bounce"></div>
                         <div className="w-1 h-1 bg-accent rounded-full animate-bounce delay-75"></div>
                         <div className="w-1 h-1 bg-accent rounded-full animate-bounce delay-150"></div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-5 border-t border-muse-200 bg-white">
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Discuss your ideas..."
                        className="w-full min-h-[48px] max-h-[120px] resize-none rounded-lg border border-muse-200 bg-muse-50 pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors text-muse-900 placeholder-muse-400 font-sans"
                        rows={1}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isStreaming}
                        className="absolute right-2 bottom-2 p-2 text-muse-400 hover:text-accent disabled:opacity-30 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 12h14" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};