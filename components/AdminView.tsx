import React from 'react';
import type { User } from '../types';
import { TrashIcon, CommunityIcon } from './icons';

interface AdminViewProps {
  users: User[];
  onBanUser: (userId: string) => void;
  currentUser: User;
}

const AdminView: React.FC<AdminViewProps> = ({
    users,
    onBanUser,
    currentUser
}) => {

  return (
    <div className="animate-fade-in space-y-12">
      {/* Gerenciamento de Usuários */}
      <section>
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-zinc-800 p-2 rounded-lg">
                <CommunityIcon className="w-6 h-6 text-zinc-300" />
            </div>
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Gerenciamento de Usuários</h2>
                <p className="text-zinc-300">Remova o acesso de usuários à plataforma.</p>
            </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
            <div className="min-w-full">
                <div className="grid grid-cols-10 gap-4 px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                    <div className="col-span-4">Nome</div>
                    <div className="col-span-4">Email</div>
                    <div className="col-span-2 text-right">Ações</div>
                </div>
                <div>
                    {users.map(user => (
                        <div key={user.id || user.email} className="grid grid-cols-10 gap-4 px-6 py-4 items-center text-sm text-zinc-300 border-b border-zinc-800 last:border-b-0 even:bg-zinc-800/50">
                            <div className="truncate col-span-4">
                                <span className="truncate">{user.name}</span>
                            </div>
                            <div className="truncate col-span-4">{user.email}</div>
                            <div className="flex justify-end col-span-2">
                                <button
                                    onClick={() => user.id && onBanUser(user.id)}
                                    disabled={currentUser.id === user.id || !user.id}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-300 bg-red-900/40 rounded-md hover:bg-red-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Banir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AdminView;