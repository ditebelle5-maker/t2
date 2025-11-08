import React, { useState } from 'react';
import { CloseIcon, SunIcon, ThemeIcon, SystemThemeIcon, CheckIcon } from './icons';
import type { Theme } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, theme, setTheme }) => {
  const [localTheme, setLocalTheme] = useState<Theme>(theme);

  const handleSave = () => {
    setTheme(localTheme);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Configurações</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <CloseIcon className="text-gray-600 dark:text-white"/>
          </button>
        </div>
        <div className="p-6 space-y-6">
            <div>
                <h4 className="text-base font-semibold text-gray-800 dark:text-zinc-200 mb-3">Aparência</h4>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                    Personalize a aparência da interface. Selecione 'Sistema' para corresponder às configurações do seu computador.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                        onClick={() => setLocalTheme('light')}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500 ${
                            localTheme === 'light' 
                            ? 'border-blue-500' 
                            : 'bg-white border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        {localTheme === 'light' && (
                            <div className="absolute top-2 right-2 bg-blue-600 rounded-full text-white p-0.5 shadow">
                                <CheckIcon className="w-3 h-3" />
                            </div>
                        )}
                        <SunIcon className="w-8 h-8 text-zinc-700 mb-2" />
                        <span className="font-semibold text-zinc-800">Claro</span>
                    </button>
                    <button 
                        onClick={() => setLocalTheme('dark')}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500 bg-black ${
                            localTheme === 'dark' 
                            ? 'border-blue-500' 
                            : 'border-zinc-800 hover:border-zinc-500'
                        }`}
                    >
                        {localTheme === 'dark' && (
                            <div className="absolute top-2 right-2 bg-blue-600 rounded-full text-white p-0.5 shadow">
                                <CheckIcon className="w-3 h-3" />
                            </div>
                        )}
                        <ThemeIcon className="w-8 h-8 text-zinc-200 mb-2" />
                        <span className="font-semibold text-zinc-100">Escuro</span>
                    </button>
                    <button 
                        onClick={() => setLocalTheme('system')}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500 ${
                            localTheme === 'system' 
                            ? 'border-blue-500' 
                            : 'bg-white dark:bg-black border-gray-300 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-500'
                        }`}
                    >
                        {localTheme === 'system' && (
                            <div className="absolute top-2 right-2 bg-blue-600 rounded-full text-white p-0.5 shadow">
                                <CheckIcon className="w-3 h-3" />
                            </div>
                        )}
                        <SystemThemeIcon className="w-8 h-8 text-zinc-700 dark:text-zinc-200 mb-2" />
                        <span className="font-semibold text-zinc-800 dark:text-zinc-100">Sistema</span>
                    </button>
                </div>
            </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-black/50 border-t border-gray-200 dark:border-zinc-800 flex justify-end space-x-3">
             <button 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-transparent border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500"
            >
                Cancelar
            </button>
            <button 
                onClick={handleSave} 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-500"
            >
                Salvar Alterações
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;