import React, { useState, useRef, useEffect } from 'react';
import { CloseIcon, UserIcon, LockClosedIcon, EmailIcon, CameraIcon } from './icons';
import type { User } from '../types';

interface ProfileModalProps {
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup the object URL to avoid memory leaks
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setSelectedFile(file);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(file));
    } else {
        alert("Por favor, selecione um arquivo de imagem válido.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = () => {
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      avatar: imagePreview || user.avatar,
    };
    onSave(updatedUser);
    
    let message = "Alterações salvas com sucesso!";
    if (selectedFile) {
        message = `Nova imagem de perfil "${selectedFile.name}" salva!`;
    }
    alert(message);
    onClose();
  };


  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Editar Perfil</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <CloseIcon className="text-gray-600 dark:text-white" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
                <img 
                    src={imagePreview || user.avatar} 
                    alt="Foto de perfil" 
                    className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 dark:border-zinc-700" 
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500"
                    aria-label="Alterar foto de perfil"
                >
                    <CameraIcon className="w-8 h-8 text-white" />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Nome
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              </span>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg pl-10 pr-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <EmailIcon className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              </span>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg pl-10 pr-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              </span>
              <input 
                type="password" 
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Deixe em branco para não alterar"
                className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg pl-10 pr-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
              />
            </div>
          </div>
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
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;