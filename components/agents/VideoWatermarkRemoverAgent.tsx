import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeftIcon, UploadIcon, CloseIcon, MagicWandIcon } from '../icons';

interface AgentProps {
  onBack: () => void;
}

const VideoWatermarkRemoverAgent: React.FC<AgentProps> = ({ onBack }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URLs to avoid memory leaks
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (processedVideoUrl && processedVideoUrl.startsWith('blob:')) URL.revokeObjectURL(processedVideoUrl);
    };
  }, [videoPreview, processedVideoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(URL.createObjectURL(file));
      setProcessedVideoUrl(null);
      setError(null);
    } else if (file) {
      setError("Por favor, selecione um arquivo de vídeo válido.");
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(URL.createObjectURL(file));
      setProcessedVideoUrl(null);
      setError(null);
    } else if (file) {
      setError("Por favor, selecione um arquivo de vídeo válido.");
    }
  }, [videoPreview]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveWatermark = () => {
    if (!videoFile) {
      setError("Por favor, envie um vídeo primeiro.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setProcessedVideoUrl(null);

    // Simulating API call and processing time
    setTimeout(() => {
      // In a real scenario, this would be the URL of the processed video from the API.
      // Here we use a different dummy video to show a change.
      const cleanedVideo = "https://dummyjson.com/video/60e52f5a689d1b0015e4a5db/download";
      setProcessedVideoUrl(cleanedVideo);
      setIsLoading(false);
    }, 4000);
  };

  const handleRemoveVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoFile(null);
    if(videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    setProcessedVideoUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-white">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Voltar
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white ml-4">Removedor de Marca D'água</h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 mt-4" style={{ height: 'calc(100vh - 12rem)' }}>
        <div className="flex flex-col space-y-4">
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !videoPreview && fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-center transition-colors flex-grow hover:border-gray-400 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-900"
          >
            {!videoPreview ? (
              <div className="cursor-pointer p-8">
                <UploadIcon className="w-12 h-12 text-gray-400 dark:text-zinc-500 mx-auto" />
                <p className="mt-4 font-semibold text-gray-700 dark:text-zinc-300">Arraste o vídeo aqui</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">ou clique para selecionar</p>
              </div>
            ) : (
              <>
                <video src={videoPreview} controls className="w-full h-full object-contain rounded-lg" />
                <button onClick={handleRemoveVideo} className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-white">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
          </div>
          <button onClick={handleRemoveWatermark} disabled={isLoading || !videoFile} className="w-full flex items-center justify-center px-4 py-2.5 font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-white">
            <MagicWandIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Processando...' : "Remover Marca D'água"}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        <div className="relative group w-full h-full bg-black border border-gray-200 dark:border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="text-center text-gray-500 dark:text-zinc-400 p-4">
              <div className="w-10 h-10 border-4 border-gray-200 dark:border-zinc-700 border-t-gray-400 dark:border-t-zinc-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-semibold">Analisando e removendo a marca...</p>
              <p className="text-sm mt-2">Isso pode levar alguns instantes.</p>
            </div>
          )}
          {processedVideoUrl && !isLoading && (
            <video src={processedVideoUrl} controls autoPlay loop className="w-full h-full object-contain animate-fade-in" />
          )}
          {!isLoading && !processedVideoUrl && (
            <div className="text-center text-gray-400 dark:text-zinc-500">
              <MagicWandIcon className="w-16 h-16 mx-auto mb-4" />
              <p>O vídeo processado aparecerá aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoWatermarkRemoverAgent;