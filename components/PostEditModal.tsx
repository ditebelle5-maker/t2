import React, { useState } from 'react';
import { CloseIcon } from './icons';
import type { Post } from '../types';

interface PostEditModalProps {
  onClose: () => void;
  onSave: (postData: { title: string, content: string }) => void;
  post: Post;
}

const PostEditModal: React.FC<PostEditModalProps> = ({ onClose, onSave, post }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
        alert('O título e o conteúdo não podem estar vazios.');
        return;
    }
    onSave({ title, content });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Editar Comunicado</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <CloseIcon className="text-gray-600 dark:text-white"/>
          </button>
        </div>
        <div className="p-6 space-y-4">
            <div>
                <label htmlFor="edit-post-title" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Título do Comunicado</label>
                <input
                    id="edit-post-title"
                    type="text"
                    placeholder="Título do comunicado"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
            </div>
            <div>
                <label htmlFor="edit-post-content" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Conteúdo do Comunicado</label>
                <textarea
                    id="edit-post-content"
                    placeholder="Conteúdo do comunicado..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
            </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-black/50 border-t border-gray-200 dark:border-zinc-800 flex justify-end items-center space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-transparent border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostEditModal;