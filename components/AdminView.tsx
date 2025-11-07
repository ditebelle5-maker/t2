import React, { useState } from 'react';
import type { Post, User } from '../types';
import { PlusIcon, TrashIcon, AdminIcon, CommunityIcon, WarningIcon, EditIcon } from './icons';
import PostEditModal from './PostEditModal';

interface AdminViewProps {
  posts: Post[];
  onCreatePost: (postData: { title: string, content: string }) => void;
  onUpdatePost: (postId: number, postData: { title: string, content: string }) => void;
  onDeletePost: (postId: number) => void;
  users: User[];
  onToggleUserWarning: (email: string) => void;
  onDeleteUser: (email: string) => void;
  onToggleUserCanPost: (email: string) => void;
  currentUser: User;
}

const AdminView: React.FC<AdminViewProps> = ({ 
    posts, 
    onCreatePost, 
    onUpdatePost,
    onDeletePost, 
    users, 
    onToggleUserWarning, 
    onDeleteUser, 
    onToggleUserCanPost,
    currentUser 
}) => {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle.trim() && newPostContent.trim()) {
      onCreatePost({ title: newPostTitle, content: newPostContent });
      setNewPostTitle('');
      setNewPostContent('');
    }
  };

  const handleSavePost = (postData: { title: string; content: string }) => {
    if (editingPost) {
      onUpdatePost(editingPost.id, postData);
      setEditingPost(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-12">
      {/* Gerenciar Comunicados */}
      <section>
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                <AdminIcon className="w-6 h-6 text-gray-600 dark:text-zinc-300" />
            </div>
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Gerenciar Comunicados</h2>
                <p className="text-gray-500 dark:text-zinc-400">Crie e remova comunicados para toda a plataforma.</p>
            </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl">
            <form onSubmit={handleAddPost} className="p-6 space-y-4">
                <input
                    type="text"
                    placeholder="Título do comunicado"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <textarea
                    placeholder="Conteúdo do comunicado..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
                <button
                    type="submit"
                    className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-600/50 dark:disabled:bg-blue-900/50 disabled:text-white/70 dark:disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500"
                    disabled={!newPostTitle.trim() || !newPostContent.trim()}
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar Comunicado
                </button>
            </form>

            <div className="p-6 border-t border-gray-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Comunicados Atuais</h3>
                <div className="space-y-4">
                    {posts.length > 0 ? posts.map(post => (
                        <div key={post.id} className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-lg flex justify-between items-start gap-4">
                           <div className="flex-grow">
                                <h4 className="font-bold text-gray-900 dark:text-white">{post.title}</h4>
                                <p className="text-xs text-gray-400 dark:text-zinc-500 mb-2">{new Date(post.id).toLocaleString()}</p>
                                <p className="text-sm text-gray-700 dark:text-zinc-300 whitespace-pre-wrap">{post.content}</p>
                           </div>
                           <div className="flex-shrink-0 flex items-center gap-2">
                                <button 
                                    onClick={() => setEditingPost(post)} 
                                    className="p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" 
                                    title="Editar comunicado"
                                >
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => onDeletePost(post.id)} 
                                    className="p-2 text-gray-500 dark:text-zinc-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" 
                                    title="Excluir comunicado"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                           </div>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500 dark:text-zinc-500 text-center py-4">Nenhum comunicado ativo.</p>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* Gerenciamento de Usuários */}
      <section>
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                <CommunityIcon className="w-6 h-6 text-gray-600 dark:text-zinc-300" />
            </div>
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Gerenciamento de Usuários</h2>
                <p className="text-gray-500 dark:text-zinc-400">Alerte ou remova o acesso de usuários à plataforma.</p>
            </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-x-auto">
            <div className="min-w-full">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800">
                    <div className="col-span-4">Nome</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-1">Função</div>
                    <div className="col-span-4 text-right">Ações</div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {users.map(user => (
                        <div key={user.email} className="grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm text-gray-700 dark:text-zinc-300">
                            <div className="truncate col-span-4 flex items-center gap-2">
                                {user.warned && <WarningIcon className="w-5 h-5 text-yellow-500 shrink-0" title="Usuário com alerta"/>}
                                <span className="truncate">{user.name}</span>
                            </div>
                            <div className="truncate col-span-3">{user.email}</div>
                            <div className="col-span-1">
                                {user.role === 'admin' ? (
                                    <span className="px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 rounded-full">admin</span>
                                ) : (
                                    <span className="px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 rounded-full">user</span>
                                )}
                            </div>
                            <div className="flex justify-end col-span-4 space-x-2">
                                {user.role === 'user' && (
                                    <button
                                        onClick={() => onToggleUserCanPost(user.email)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950 ${
                                            user.canPost 
                                            ? 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 hover:bg-gray-300 dark:hover:bg-zinc-600 focus:ring-blue-500'
                                            : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 focus:ring-blue-500'
                                        }`}
                                    >
                                        {user.canPost ? 'Revogar Post' : 'Permitir Post'}
                                    </button>
                                )}
                                <button 
                                    onClick={() => onToggleUserWarning(user.email)}
                                    disabled={currentUser.email === user.email}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed ${
                                        user.warned 
                                        ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-700 focus:ring-yellow-500'
                                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 focus:ring-yellow-500'
                                    }`}
                                >
                                    {user.warned ? 'Remover Alerta' : 'Alertar'}
                                </button>
                                <button
                                    onClick={() => onDeleteUser(user.email)}
                                    disabled={currentUser.email === user.email}
                                    className="px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 rounded-md hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Banir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>
      
      {editingPost && (
        <PostEditModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleSavePost}
        />
      )}
    </div>
  );
};

export default AdminView;