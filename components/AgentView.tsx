import React, { useState } from 'react';
import { ChatBubbleIcon, SparklesIcon, ArrowLeftIcon, LightbulbIcon, ReplicateIcon, MagicWandIcon } from './icons';
import GeminiChatAgent from './agents/GeminiChatAgent';
import ImageGenerationAgent from './agents/ImageGenerationAgent';
import PromptSpecialistAgent from './agents/PromptSpecialistAgent';
import ImageReplicatorAgent from './agents/ImageReplicatorAgent';
import VideoWatermarkRemoverAgent from './agents/VideoWatermarkRemoverAgent';
import type { HistoryItem, AgentType as AgentId, ChatHistory } from '../types';

interface AgentViewProps {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteHistoryItem: (id: number) => void;
  clearAgentHistory: (agentId: AgentId) => void;
  chatHistories: ChatHistory[];
  saveChatHistory: (chat: ChatHistory) => void;
  deleteChatHistory: (id: number) => void;
  clearAllChatHistory: () => void;
}

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
        description: "Converse com um modelo de linguagem avançado para tirar dúvidas, gerar ideias e muito mais.",
        icon: ChatBubbleIcon,
        component: GeminiChatAgent
    },
    { 
        id: 'generator',
        title: "Gerador de Imagem", 
        description: "Crie e edite imagens realistas a partir de texto usando modelos de difusão de última geração.",
        icon: SparklesIcon,
        component: ImageGenerationAgent
    },
    {
        id: 'watermarkRemover',
        title: "Removedor de Marca D'água",
        description: "Envie um vídeo e a IA tentará remover a marca d'água de forma inteligente e preservar a qualidade.",
        icon: MagicWandIcon,
        component: VideoWatermarkRemoverAgent
    },
    {
        id: 'imageReplicator',
        title: "Analisador de Imagem (Vision)",
        description: "Envie uma imagem e use IA para analisá-la e gerar prompts detalhados para recriação.",
        icon: ReplicateIcon,
        component: ImageReplicatorAgent
    },
    {
        id: 'promptSpecialist',
        title: "Especialista em Prompt",
        description: "Transforme ideias simples em prompts detalhados e eficazes para modelos de imagem e vídeo.",
        icon: LightbulbIcon,
        component: PromptSpecialistAgent
    }
];

const AgentCard: React.FC<{ agent: Agent; onSelect: () => void }> = ({ agent, onSelect }) => (
    <div 
        onClick={onSelect}
        className="group relative bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800/80 transition-all duration-300 cursor-pointer border border-zinc-800 hover:border-zinc-700"
    >
        <div className="absolute top-4 right-4 px-2.5 py-1 text-xs font-bold tracking-wider text-green-300 bg-green-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-fade-in-up-fast pointer-events-none">
            FEITO
        </div>
        <div className="flex items-center mb-4">
            <div className="p-2 bg-zinc-800 rounded-lg">
                <agent.icon className="w-6 h-6 text-zinc-300" />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-zinc-100">{agent.title}</h3>
        </div>
        <p className="text-zinc-300 text-sm">{agent.description}</p>
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
             <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-white">Central de Agentes de IA</h2>
                <p className="mt-2 text-lg text-zinc-300">Suas ferramentas criativas para acelerar a produção de conteúdo.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map(agent => (
                    <AgentCard key={agent.id} agent={agent} onSelect={() => handleSelectAgent(agent.id)} />
                ))}
            </div>
        </div>
    );
};

export default AgentView;