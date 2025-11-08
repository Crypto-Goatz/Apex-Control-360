
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, GlobeAltIcon } from './icons';
import { ChatMessage, GroundingSource } from '../types';
import { GenerateContentResponse } from '@google/genai';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useSearch, setUseSearch] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));
            const response: GenerateContentResponse = await getChatResponse(history, input, useSearch);

            const modelText = response.text;
            let sources: GroundingSource[] | undefined = undefined;

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                sources = groundingChunks.map((chunk: any) => {
                    const source = chunk.web || chunk.maps;
                    return { uri: source.uri, title: source.title };
                }).filter((s: GroundingSource) => s.uri && s.title);
            }

            const modelMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: modelText,
                sources: sources,
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Sorry, I encountered an error. Please check your API key and try again."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 bg-brand-primary h-16 w-16 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-brand-secondary transition-transform transform hover:scale-110 z-50"
            >
                {isOpen ? <XMarkIcon className="w-8 h-8" /> : <ChatBubbleLeftRightIcon className="w-8 h-8" />}
            </button>
            {isOpen && (
                <div className="fixed bottom-28 right-8 w-96 h-[600px] bg-dark-card border border-dark-border rounded-xl shadow-2xl flex flex-col z-50 animate-fade-in">
                    <header className="p-4 border-b border-dark-border">
                        <h2 className="text-xl font-bold">AI Assistant</h2>
                        <p className="text-sm text-gray-400">Powered by Gemini</p>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-xl max-w-xs ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-white/10'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-2 border-t border-white/20 pt-2 space-y-1">
                                            <h4 className="text-xs font-semibold">Sources:</h4>
                                            {msg.sources.map((source, index) => (
                                                <a key={index} href={source.uri} target="_blank" rel="noopener noreferrer" className="block text-xs text-brand-accent hover:underline truncate">
                                                    {source.title}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-xl bg-white/10 animate-pulse">
                                    <p className="text-sm">Thinking...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-dark-border">
                        <div className="flex items-center space-x-2 mb-2">
                             <button onClick={() => setUseSearch(!useSearch)} className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full border transition-colors ${useSearch ? 'bg-blue-500/50 border-blue-400' : 'border-dark-border hover:bg-white/10'}`}>
                                <GlobeAltIcon className="w-4 h-4" /> <span>Web Search</span>
                            </button>
                        </div>
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-white/5 border border-dark-border rounded-lg p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            />
                            <button type="submit" disabled={isLoading} className="p-3 bg-brand-primary rounded-lg text-white hover:bg-brand-secondary disabled:opacity-50">
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;