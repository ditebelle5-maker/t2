import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, SendIcon } from '../icons';
import { GoogleGenAI } from '@google/genai';
import type { ChatMessage, ChatHistory } from '../../types';
import type { Chat } from '@google/genai';
import ChatHistorySidebar from '../ChatHistorySidebar';

interface AgentProps {
    onBack: () => void;
    chatHistories: ChatHistory[];
    saveChatHistory: (chat: ChatHistory) => void;
    deleteChatHistory: (id: number) => void;
    clearAllChatHistory: () => void;
}

const GeminiChatAgent: React.FC<AgentProps> = ({ 
    onBack, 
    chatHistories,
    saveChatHistory,
    deleteChatHistory,
    clearAllChatHistory
}) => {
    const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const messages = currentChat?.messages ?? [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleNewChat = () => {
        setCurrentChat(null);
        chatRef.current = null;
        setInput('');
        setIsLoading(false);
        setError(null);
    };

    const handleSelectChat = (id: number) => {
        const selected = chatHistories.find(c => c.id === id);
        if (selected) {
            setCurrentChat(selected);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                history: selected.messages,
            });
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        setError(null);

        let chatToUpdate: ChatHistory;
        if (currentChat) {
            chatToUpdate = { ...currentChat, messages: [...currentChat.messages, userMessage] };
        } else {
            chatToUpdate = {
                id: Date.now(),
                title: currentInput.substring(0, 40) + (currentInput.length > 40 ? '...' : ''),
                timestamp: new Date().toISOString(),
                messages: [userMessage],
            };
        }
        setCurrentChat(chatToUpdate);
        
        try {
            if (!chatRef.current) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash' });
            }

            const stream = await chatRef.current.sendMessageStream({ message: currentInput });
            
            let modelResponseText = '';
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: '' }] };
            setCurrentChat(prev => ({...prev!, messages: [...prev!.messages, modelMessage]}));

            for await (const chunk of stream) {
                modelResponseText += chunk.text;
                setCurrentChat(prev => {
                    if (!prev) return prev;
                    const updatedMessages = [...prev.messages];
                    updatedMessages[updatedMessages.length - 1] = { ...modelMessage, parts: [{ text: modelResponseText }] };
                    return { ...prev, messages: updatedMessages };
                });
            }
            
            // Final save after stream completion
            saveChatHistory({
                ...chatToUpdate,
                messages: [...chatToUpdate.messages, { role: 'model', parts: [{ text: modelResponseText }] }],
            });

        } catch (e) {
            console.error(e);
            setError('Ocorreu um erro ao comunicar com a IA. Tente novamente.');
            // Revert user message on error
            setCurrentChat(prev => {
                if(!prev) return null;
                return {...prev, messages: prev.messages.slice(0, -1)};
            });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm animate-fade-in" style={{ height: 'calc(100vh - 8rem)' }}>
            <div className="flex items-center p-3 border-b border-zinc-800 shrink-0">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-200 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Voltar
                </button>
                <h1 className="text-lg font-bold text-white ml-4">GPT5</h1>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/4 max-w-xs border-r border-zinc-800">
                    <ChatHistorySidebar
                        histories={chatHistories}
                        onSelect={handleSelectChat}
                        onDelete={deleteChatHistory}
                        onClear={clearAllChatHistory}
                        onNew={handleNewChat}
                        selectedId={currentChat?.id || null}
                    />
                </div>

                <div className="flex-1 flex flex-col bg-transparent">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 && !isLoading && (
                            <div className="flex h-full items-center justify-center text-center text-zinc-400">
                                <div className="p-4">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-zinc-700 mb-4"></div>
                                    <h2 className="text-2xl font-bold text-zinc-200">GPT5</h2>
                                    <p className="mt-2">Como posso ajudar hoje?</p>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-zinc-700 shrink-0"></div>}
                                <div className={`max-w-xl px-4 py-2.5 rounded-2xl ${msg.role === 'user' ? 'bg-zinc-700 text-white rounded-br-lg' : 'bg-zinc-800 text-zinc-200 rounded-bl-lg'}`}>
                                    <p className="whitespace-pre-wrap text-sm">{msg.parts[0].text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && messages[messages.length-1]?.role === 'user' && (
                             <div className="flex items-start gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-zinc-700 shrink-0"></div>
                                <div className="max-w-lg px-4 py-2.5 rounded-2xl bg-zinc-800 text-zinc-200">
                                    <span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center px-6 pb-2">{error}</p>}
                    <div className="p-4 border-t border-zinc-800">
                         <div className="relative">
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Digite sua mensagem..."
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white transition resize-none"
                                rows={1}
                                disabled={isLoading}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
                                aria-label="Enviar mensagem"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeminiChatAgent;