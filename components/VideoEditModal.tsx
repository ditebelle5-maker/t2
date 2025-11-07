import React, { useState } from 'react';
import { CloseIcon, UploadIcon } from './icons';
import type { Video } from '../types';

interface VideoEditModalProps {
  onClose: () => void;
  onSave: (videoData: Omit<Video, 'id'>) => void;
  video: Video | null;
}

type InputType = 'url' | 'upload';

const VideoEditModal: React.FC<VideoEditModalProps> = ({ onClose, onSave, video }) => {
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    duration: video?.duration || '',
    thumbnail: video?.thumbnail || '',
    videoUrl: video?.videoUrl || '',
  });
  const [inputType, setInputType] = useState<InputType>('url');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('video/')) {
        setVideoFile(file);
        setFormData(prev => ({...prev, videoUrl: ''})); // Clear URL if file is chosen
      } else if (file) {
          alert("Por favor, selecione um arquivo de vídeo válido.");
      }
  };

  const handleSaveChanges = async () => {
    let finalVideoUrl = formData.videoUrl;

    if (inputType === 'upload') {
        if (!videoFile) {
            alert('Por favor, selecione um arquivo de vídeo para enviar.');
            return;
        }
        finalVideoUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(videoFile);
        });
    }

    const dataToSave = { ...formData, videoUrl: finalVideoUrl };
    
    if (Object.values(dataToSave).some(val => typeof val === 'string' && val.trim() === '')) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onSave(dataToSave);
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{video ? 'Editar Aula' : 'Adicionar Nova Aula'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <CloseIcon className="text-gray-600 dark:text-white"/>
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Título da Aula</label>
                <input id="title" type="text" placeholder="Ex: Introdução ao React" value={formData.title} onChange={handleInputChange} className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Descrição</label>
                <textarea id="description" placeholder="Um resumo sobre o que a aula aborda." rows={3} value={formData.description} onChange={handleInputChange} className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
            </div>
             <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Duração</label>
                <input id="duration" type="text" placeholder="Ex: 15:30" value={formData.duration} onChange={handleInputChange} className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">URL da Miniatura (Thumbnail)</label>
                <input id="thumbnail" type="text" placeholder="https://exemplo.com/imagem.png" value={formData.thumbnail} onChange={handleInputChange} className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Fonte do Vídeo</label>
                <div className="p-1 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg grid grid-cols-2 gap-1">
                    <button onClick={() => setInputType('url')} className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${inputType === 'url' ? 'bg-gray-300 dark:bg-zinc-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}>Link Externo</button>
                    <button onClick={() => setInputType('upload')} className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${inputType === 'upload' ? 'bg-gray-300 dark:bg-zinc-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}>Enviar Arquivo</button>
                </div>
            </div>

            {inputType === 'url' ? (
                <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">URL do Vídeo</label>
                    <input id="videoUrl" type="text" placeholder="https://youtube.com/watch?v=..." value={formData.videoUrl} onChange={handleInputChange} className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
            ) : (
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Arquivo de Vídeo</label>
                    <label htmlFor="video-upload" className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-900 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
                        <UploadIcon className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
                        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                            {videoFile ? <span className="font-semibold text-green-600 dark:text-green-400">{videoFile.name}</span> : 'Clique para selecionar ou arraste o arquivo'}
                        </p>
                        <input id="video-upload" type="file" className="sr-only" onChange={handleFileChange} accept="video/*" />
                    </label>
                 </div>
            )}

        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-black/50 border-t border-gray-200 dark:border-zinc-800 flex justify-end space-x-3 rounded-b-2xl">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-transparent border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSaveChanges} 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-500"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditModal;