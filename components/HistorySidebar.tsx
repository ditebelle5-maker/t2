import React from 'react';
import type { HistoryItem, AgentType } from '../types';
import { TrashIcon, PlusCircleIcon } from './icons';

interface Props {
  history: HistoryItem[];
  agentType: AgentType;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: number) => void;
  onClear: () => void;
  onNew: () => void;
  selectedId: number | null;
}

const HistorySidebar: React.FC<Props> = ({ history, agentType, onSelect, onDelete, onClear, onNew, selectedId }) => {
  const filteredHistory = history.filter(item => item.agentType === agentType);

  return (
    <div className="w-56 shrink-0 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-white text-lg">Histórico</h3>
        <button 
          onClick={onNew} 
          title="Nova Criação"
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-blue-500"
        >
          <PlusCircleIcon className="w-6 h-6"/>
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-zinc-500 px-4">
              <p className="text-sm">Nenhuma criação no histórico deste agente ainda.</p>
          </div>
        ) : (
          <ul className="p-2 space-y-1">
            {filteredHistory.map(item => (
              <li 
                key={item.id} 
                onClick={() => onSelect(item)}
                className={`group p-3 rounded-lg cursor-pointer transition-colors ${selectedId === item.id ? 'bg-zinc-800' : 'hover:bg-zinc-800'}`}
              >
                <div className="flex justify-between items-start">
                    <p className="text-sm text-zinc-200 font-medium truncate pr-2 flex-1">{item.prompt}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                      className="p-1 text-zinc-500 hover:text-red-500 hover:bg-zinc-700/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                      title="Deletar item"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
                <span className="text-xs text-zinc-500">{new Date(item.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {filteredHistory.length > 0 && (
        <div className="p-3 border-t border-zinc-800 shrink-0">
          <button 
            onClick={onClear} 
            className="w-full text-center px-3 py-2 text-sm font-medium text-red-500 bg-red-900/20 rounded-lg hover:bg-red-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-red-500"
          >
            Limpar Histórico
          </button>
        </div>
      )}
    </div>
  );
};

export default HistorySidebar;