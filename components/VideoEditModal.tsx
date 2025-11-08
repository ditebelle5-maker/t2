import React, { useState } from 'react';
import { CloseIcon } from './icons';
import type { Video } from '../types';

interface VideoEditModalProps {
  onClose: () => void;
  onSave: (videoData: Partial<Omit<Video, 'id'>>) => void;
  video: Video | null;
}

const VideoEditModal: React.FC<VideoEditModalProps> = ({ onClose, onSave, video }) => {
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    videoUrl: video?.videoUrl || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = () => {
    if (!formData.title.trim()) {
      alert('Por favor, preencha o título da aula.');
      return;
    }

    const dataToSave = {
      title: formData.title,
      description: formData.description,
      videoUrl: formData.videoUrl,
      duration: video?.duration || '00:00',
    };
    
    onSave(dataToSave);
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <h3 className="text-xl font-semibold text-white">{video ? 'Editar Aula' : 'Adicionar Nova Aula'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white">
            <CloseIcon className="text-white"/>
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">Título da Aula</label>
                <input id="title" type="text" placeholder="Ex: Introdução ao React" value={formData.title} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white transition" />
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">Descrição</label>
                <textarea id="description" placeholder="Descreva o conteúdo da aula..." value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white transition resize-none" />
            </div>
            <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-zinc-300 mb-2">URL do Vídeo (Ex: YouTube)</label>
                <input id="videoUrl" type="text" placeholder="https://youtube.com/watch?v=..." value={formData.videoUrl} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white transition" />
            </div>
        </div>
        <div className="px-6 py-4 bg-zinc-900/80 border-t border-zinc-800 flex justify-end space-x-3 rounded-b-2xl">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-zinc-300 bg-transparent border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSaveChanges} 
            className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditModal;