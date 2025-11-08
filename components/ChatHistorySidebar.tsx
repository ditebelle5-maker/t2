import React from 'react';
import type { ChatHistory } from '../types';
import { TrashIcon, PlusIcon } from './icons';

interface Props {
  histories: ChatHistory[];
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onClear: () => void; // Kept in props for API compatibility, but UI element is removed.
  onNew: () => void;
  selectedId: number | null;
}

const ChatHistorySidebar: React.FC<Props> = ({ histories, onSelect, onDelete, onNew, selectedId }) => {
  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conversas</h2>
        <button 
            onClick={onNew} 
            title="Nova Conversa"
            className="p-2 rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {histories.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-zinc-500 px-4">
            <p className="text-sm">Nenhuma conversa no histórico ainda.</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {histories.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={`group w-full text-left flex justify-between items-center p-2 rounded-md transition-colors text-sm ${
                    selectedId === item.id 
                      ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-medium' 
                      : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="truncate pr-2">{item.title}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="p-1 text-gray-400 dark:text-zinc-500 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    title="Deletar conversa"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatHistorySidebar;