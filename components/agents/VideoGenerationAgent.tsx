import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeftIcon, VideoCameraIcon, DownloadIcon, UploadIcon, CloseIcon } from '../icons';
import { GoogleGenAI } from '@google/genai';
import type { GenerateVideosOperation } from '@google/genai';
import HistorySidebar from '../HistorySidebar';
import type { HistoryItem, AgentType } from '../../types';

interface AgentProps {
    onBack: () => void;
    history: HistoryItem[];
    addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    deleteHistoryItem: (id: number) => void;
    clearAgentHistory: (agentType: AgentType) => void;
}

const loadingMessages = [
    "Iniciando a renderização com SORA...",
    "Processando os frames iniciais...",
    "Aplicando efeitos visuais complexos...",
    "Aguardando a computação na nuvem da OpenAI...",
    "Quase pronto, finalizando o vídeo...",
    "A geração de vídeo com SORA pode levar alguns minutos. Agradecemos a sua paciência."
];

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
};

const VideoGenerationAgent: React.FC<AgentProps> = ({ onBack, history, addToHistory, deleteHistoryItem, clearAgentHistory }) => {
    const [prompt, setPrompt] = useState('');
    const [model, setModel] = useState('sora'); // 'sora' or 'veo'
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [error, setError] = useState<string | null>(null);
    const [apiKeySelected, setApiKeySelected] = useState(true); // Assuming key is managed elsewhere for OpenAI for now
    const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
    
    const pollingRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // For SORA, we might need a different key management, for now we assume it's handled.
        // const checkKey = async () => {
        //     if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        //         setApiKeySelected(true);
        //     }
        // };
        // checkKey();
        return () => {
            if (pollingRef.current) clearTimeout(pollingRef.current);
            if (videoUrl && videoUrl.startsWith('blob:')) URL.revokeObjectURL(videoUrl);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, []);
    
    useEffect(() => {
        let messageInterval: number;
        if (isLoading) {
            let i = 0;
            messageInterval = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[i]);
            }, 5000);
        }
        return () => clearInterval(messageInterval);
    }, [isLoading]);

    const handleNew = () => {
        setPrompt('');
        if (videoUrl && videoUrl.startsWith('blob:')) URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsLoading(false);
        setError(null);
        setSelectedHistoryId(null);
    };

    const handleSelectHistory = (item: HistoryItem) => {
        handleNew();
        setPrompt(item.prompt);
        setVideoUrl(item.output);
        setImagePreview(item.inputImage || null);
        setSelectedHistoryId(item.id);
    };
    
    const handleSelectKey = async () => {
        // This flow is for Google AI Studio, might need adjustment for OpenAI
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            setApiKeySelected(true);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            setImageFile(file);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(URL.createObjectURL(file));
        }
    }, [imagePreview]);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageFile(null);
        if(imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleDownloadVideo = () => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `sora-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const pollOperation = async (operation: GenerateVideosOperation, currentPrompt: string, currentInputImageBase64?: string) => {
        try {
            // TODO: Substituir pela API SORA da OpenAI (poling pode ser diferente)
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const updatedOperation = await ai.operations.getVideosOperation({ operation });

            if (updatedOperation.done) {
                const downloadLink = updatedOperation.response?.generatedVideos?.[0]?.video?.uri;
                if (downloadLink) {
                    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                    if (!videoResponse.ok) throw new Error('Falha ao baixar o vídeo gerado.');
                    const blob = await videoResponse.blob();
                    const url = URL.createObjectURL(blob);
                    setVideoUrl(url);
                    addToHistory({
                        agentType: 'videoGenerator',
                        prompt: currentPrompt,
                        inputImage: currentInputImageBase64,
                        output: url,
                    });
                } else {
                    throw new Error('Operação concluída, mas nenhum link de vídeo foi retornado.');
                }
                setIsLoading(false);
            } else {
                pollingRef.current = window.setTimeout(() => pollOperation(updatedOperation, currentPrompt, currentInputImageBase64), 10000);
            }
        } catch (e: any) {
            console.error(e);
            let errorMessage = 'Ocorreu um erro durante a geração do vídeo. Tente novamente.';
            if (e.message?.includes('Requested entity was not found')) {
                 errorMessage = 'A chave de API não foi encontrada ou é inválida. Por favor, selecione uma chave de API válida.';
                 setApiKeySelected(false);
            }
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() && !imageFile) {
            setError('Por favor, insira uma descrição ou envie uma imagem.');
            return;
        }
        
        setError("A integração com a API SORA da OpenAI ainda não está disponível publicamente. Esta é uma demonstração da interface.");
        // Mock loading state for demonstration
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setError("Simulação finalizada. A API do SORA não foi chamada.");
        }, 10000);
        return;

        /*
        // TODO: Substituir pela API SORA da OpenAI
        
        if (videoUrl && videoUrl.startsWith('blob:')) URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
        setIsLoading(true);
        setError(null);
        setSelectedHistoryId(null);
        setLoadingMessage(loadingMessages[0]);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const payload: any = {
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
            };
            let inputImageBase64: string | undefined = undefined;

            if (imageFile) {
                inputImageBase64 = await fileToBase64(imageFile);
                payload.image = {
                    imageBytes: inputImageBase64.split(',')[1],
                    mimeType: imageFile.type,
                };
            }

            const operation = await ai.models.generateVideos(payload);
            pollOperation(operation, prompt, inputImageBase64);
        } catch (e: any) {
            console.error(e);
            let errorMessage = 'Falha ao iniciar a geração do vídeo. Verifique o console para detalhes.';
             if (e.message?.includes('Requested entity was not found')) {
                 errorMessage = 'A chave de API não foi encontrada ou é inválida. Por favor, selecione uma chave de API válida.';
                 setApiKeySelected(false);
            }
            setError(errorMessage);
            setIsLoading(false);
        }
        */
    };
    
    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-500">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Voltar
                </button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white ml-4">Gerador de Vídeo</h2>
            </div>
            <div className="flex gap-8 mt-4" style={{ height: 'calc(100vh - 12rem)' }}>
                 <HistorySidebar
                    agentType="videoGenerator"
                    history={history}
                    onSelect={handleSelectHistory}
                    onDelete={deleteHistoryItem}
                    onClear={() => clearAgentHistory('videoGenerator')}
                    onNew={handleNew}
                    selectedId={selectedHistoryId}
                />
                <div className="flex-grow grid lg:grid-cols-2 gap-8 overflow-y-auto pr-4">
                    <div className="flex flex-col h-full">
                        <div className="flex-grow space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">1. Adicione uma imagem de referência (Opcional)</label>
                                <div 
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => !imagePreview && fileInputRef.current?.click()}
                                    className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-center transition-colors h-48 hover:border-gray-400 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-900"
                                >
                                    {!imagePreview ? (
                                        <div className="cursor-pointer p-8">
                                            <UploadIcon className="w-10 h-10 text-gray-400 dark:text-zinc-500 mx-auto" />
                                            <p className="mt-4 font-semibold text-gray-700 dark:text-zinc-300">Arraste a imagem</p>
                                            <p className="text-sm text-gray-500 dark:text-zinc-400">ou clique para enviar</p>
                                        </div>
                                    ) : (
                                        <>
                                            <img src={imagePreview} alt="Pré-visualização" className="w-full h-full object-contain rounded-lg" />
                                            <button onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <CloseIcon className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">2. Escolha o modelo</label>
                                <div className="grid grid-cols-2 gap-4">
                                     <button onClick={() => setModel('sora')} className={`px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-400 ${model === 'sora' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-400 dark:hover:border-zinc-700'}`}>
                                        Sora
                                    </button>
                                    <button disabled onClick={() => setModel('veo')} className={`px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-400 ${model === 'veo' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 text-gray-600 dark:text-zinc-400'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                                        Veo 3.1 (Desabilitado)
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="shrink-0 mt-6 pt-6 border-t border-gray-200 dark:border-zinc-800">
                            <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">3. Descreva a cena</label>
                            <div className="relative">
                                <textarea
                                    id="prompt-input"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Ex: um astronauta surfando em uma onda cósmica..."
                                    rows={4}
                                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg pl-4 pr-32 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition resize-none"
                                />
                                <button 
                                    onClick={handleGenerate} 
                                    disabled={isLoading || (!prompt.trim() && !imageFile)} 
                                    className="absolute right-3 bottom-3 flex items-center justify-center px-4 h-10 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-500"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-zinc-400 border-t-white rounded-full animate-spin mr-2"></div>
                                            <span>Gerando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <VideoCameraIcon className="w-5 h-5 mr-2" />
                                            <span>Gerar</span>
                                        </>
                                    )}
                                </button>
                            </div>
                             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                    </div>
                    
                    <div className="relative group w-full aspect-video bg-black border border-gray-200 dark:border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                        {isLoading && (
                            <div className="text-center text-gray-500 dark:text-zinc-400 p-4">
                                <div className="w-10 h-10 border-4 border-gray-200 dark:border-zinc-700 border-t-gray-400 dark:border-t-zinc-400 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="font-semibold">Gerando seu vídeo...</p>
                                <p className="text-sm mt-2">{loadingMessage}</p>
                            </div>
                        )}
                        {videoUrl && !isLoading && (
                             <>
                                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain animate-fade-in" />
                                <button
                                    onClick={handleDownloadVideo}
                                    className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
                                    title="Baixar Vídeo"
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        {!isLoading && !videoUrl && (
                            <div className="text-center text-gray-400 dark:text-zinc-500">
                                <VideoCameraIcon className="w-16 h-16 mx-auto mb-4" />
                                <p>Seu vídeo aparecerá aqui.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoGenerationAgent;