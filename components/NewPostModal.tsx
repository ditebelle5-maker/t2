import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon, CameraIcon } from './icons';
import type { User } from '../types';

interface NewPostModalProps {
  onClose: () => void;
  onCreatePost: (postData: { title: string, content: string, imageUrls?: string[] }) => void;
  user: User;
}

const MAX_IMAGES = 4;

const NewPostModal: React.FC<NewPostModalProps> = ({ onClose, onCreatePost, user }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      imagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [imagePreviews]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const currentCount = imageFiles.length;
    const newFiles: File[] = Array.from(files);
    
    let allowedNewFiles = newFiles;
    if (currentCount + newFiles.length > MAX_IMAGES) {
      alert(`Você pode anexar no máximo ${MAX_IMAGES} imagens.`);
      allowedNewFiles = newFiles.slice(0, MAX_IMAGES - currentCount);
    }
    
    if (allowedNewFiles.length === 0) return;

    setImageFiles(prev => [...prev, ...allowedNewFiles]);
    const newPreviews = allowedNewFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  }, [imageFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
  }, []);


  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || (!content.trim() && imageFiles.length === 0)) return;

    let imageUrls: string[] | undefined = undefined;
    if (imageFiles.length > 0) {
        imageUrls = await Promise.all(imageFiles.map(file => new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        })));
    }

    onCreatePost({ title, content, imageUrls });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Criar Post</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <CloseIcon className="text-gray-600 dark:text-white" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-start space-x-4">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
              <div className="w-full">
                  <input
                    type="text"
                    placeholder="Título do seu post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-xl font-semibold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none mb-2"
                    autoFocus
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`No que você está pensando, ${user.name.split(' ')[0]}?`}
                    className="w-full min-h-[100px] bg-transparent text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 resize-none focus:outline-none"
                  />
              </div>
          </div>

           <div 
            onDrop={handleDrop} 
            onDragOver={handleDragOver}
            className="mt-4"
          >
            {imagePreviews.length > 0 && (
                <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {imagePreviews.map((previewUrl, index) => (
                        <div key={index} className="relative w-full aspect-square">
                            <img src={previewUrl} alt={`Preview ${index+1}`} className="rounded-lg w-full h-full object-cover" />
                            <button 
                                onClick={() => removeImage(index)} 
                                className="absolute -top-1.5 -right-1.5 bg-gray-700 dark:bg-zinc-800 text-white rounded-full p-1 hover:bg-gray-600 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Remover imagem"
                            >
                                <CloseIcon className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {imageFiles.length < MAX_IMAGES && (
                <label htmlFor="post-image-upload" className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-900 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
                    <CameraIcon className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                        <span className="font-semibold">Adicionar fotos ou GIFs</span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">ou arraste e solte</p>
                    <input id="post-image-upload" ref={fileInputRef} type="file" onChange={handleFileChange} accept="image/*" className="sr-only" multiple />
                </label>
            )}
        </div>

        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end items-center">
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || (!content.trim() && imageFiles.length === 0)}
            className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPostModal;