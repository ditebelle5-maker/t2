import React, { useState } from 'react';
import { ChatBubbleIcon, SparklesIcon, ArrowLeftIcon, LightbulbIcon, VideoCameraIcon, ReplicateIcon } from './icons';
import GeminiChatAgent from './agents/GeminiChatAgent';
import ImageGenerationAgent from './agents/ImageGenerationAgent';
import PromptSpecialistAgent from './agents/PromptSpecialistAgent';
import VideoGenerationAgent from './agents/VideoGenerationAgent';
import ImageReplicatorAgent from './agents/ImageReplicatorAgent';
import type { HistoryItem, AgentType as AgentId, ChatHistory } from '../types';

interface AgentViewProps {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteHistoryItem: (id: number) => void;
  clearAgentHistory: (agentType: AgentId) => void;
  chatHistories: ChatHistory[];
  saveChatHistory: (chat: ChatHistory) => void;
  deleteChatHistory: (id: number) => void;
  clearAllChatHistory: () => void;
}

type AgentComponentProps = {
    onBack: () => void;
    history: HistoryItem[];
    addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    deleteHistoryItem: (id: number) => void;
    clearAgentHistory: (agentType: AgentId) => void;
};

interface Agent {
    id: AgentId | 'chat';
    title: string;
    description: string;
    icon: React.FC<{className?: string}>;
    component: React.FC<any>;
}

const agents: Agent[] = [
    { 
        id: 'chat',
        title: "GPT5", 
        description: "Converse com o GPT-5, o mais novo modelo de linguagem da OpenAI, para tirar dúvidas, gerar ideias e muito mais.",
        icon: ChatBubbleIcon,
        component: GeminiChatAgent
    },
    {
        id: 'imageReplicator',
        title: "Analisador de Imagem (Vision)",
        description: "Envie uma imagem e use o GPT-4 com Vision para analisá-la e gerar prompts para recriação.",
        icon: ReplicateIcon,
        component: ImageReplicatorAgent
    },
    { 
        id: 'generator',
        title: "Gerador de Imagem", 
        description: "Crie e edite imagens realistas a partir de texto usando o modelo DALL-E 3 da OpenAI.",
        icon: SparklesIcon,
        component: ImageGenerationAgent
    },
    {
        id: 'videoGenerator',
        title: "Gerador de Vídeo",
        description: "Crie vídeos de alta qualidade a partir de texto usando o modelo SORA da OpenAI.",
        icon: VideoCameraIcon,
        component: VideoGenerationAgent
    },
    {
        id: 'promptSpecialist',
        title: "Especialista em Prompt",
        description: "Use o poder do GPT-4 para transformar ideias simples em prompts detalhados para DALL-E e SORA.",
        icon: LightbulbIcon,
        component: PromptSpecialistAgent
    }
];

const AgentCard: React.FC<{ agent: Agent; onSelect: () => void }> = ({ agent, onSelect }) => (
    <div 
        onClick={onSelect}
        className="bg-white dark:bg-zinc-950 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-zinc-800"
    >
        <div className="flex items-center mb-4">
            <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                <agent.icon className="w-6 h-6 text-gray-600 dark:text-zinc-300" />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-zinc-100">{agent.title}</h3>
        </div>
        <p className="text-gray-500 dark:text-zinc-400 text-sm">{agent.description}</p>
    </div>
);

const AgentView: React.FC<AgentViewProps> = (props) => {
    const [activeAgent, setActiveAgent] = useState<AgentId | 'chat' | null>(null);

    const handleSelectAgent = (id: AgentId | 'chat') => {
        setActiveAgent(id);
    };

    const handleBack = () => {
        setActiveAgent(null);
    };

    const ActiveAgentComponent = agents.find(a => a.id === activeAgent)?.component;

    if (activeAgent && ActiveAgentComponent) {
        return <ActiveAgentComponent onBack={handleBack} {...props} />;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Agentes de IA</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map(agent => (
                    <AgentCard key={agent.id} agent={agent} onSelect={() => handleSelectAgent(agent.id)} />
                ))}
            </div>
        </div>
    );
};

export default AgentView;