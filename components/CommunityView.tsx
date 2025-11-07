import React, { useState } from 'react';
import { DiscordIcon } from './icons';
import type { User, Post, Comment } from '../types';
import NewPostModal from './NewPostModal';
import PostCard from './PostCard';

const AnnouncementItem: React.FC<{ post: Post }> = ({ post }) => (
    <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
        <p className="font-semibold text-sm text-gray-800 dark:text-zinc-200 truncate">{post.title}</p>
        <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500 dark:text-zinc-400">{post.author}</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500">{post.time}</p>
        </div>
    </div>
);


interface CommunityViewProps {
    user: User;
    posts: Post[];
    handleLikeToggle: (postId: number) => void;
    handlePinToggle: (postId: number) => void;
    allUsers: User[];
    onCreatePost: (postData: { title: string; content: string; imageUrls?: string[] }) => void;
    onCreateComment: (postId: number, content: string) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ user, posts, handleLikeToggle, handlePinToggle, allUsers, onCreatePost, onCreateComment }) => {
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
    const adminNames = allUsers.filter(u => u.role === 'admin').map(u => u.name);
    const announcements = posts.filter(post => adminNames.includes(post.author));


  return (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Comunidade</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
                {user.canPost && (
                    <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-4">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        <button
                            onClick={() => setIsNewPostModalOpen(true)}
                            className="w-full text-left bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500"
                        >
                            Crie um novo post...
                        </button>
                    </div>
                )}
                {posts.map(post => (
                    <PostCard 
                        key={post.id}
                        post={post}
                        onLikeToggle={handleLikeToggle}
                        onPinToggle={handlePinToggle}
                        onCreateComment={onCreateComment}
                        currentUser={user}
                    />
                ))}
            </div>
            <aside className="lg:col-span-1">
                <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-4 sticky top-8">
                     <a 
                        href="#"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#5865F2] rounded-lg hover:bg-[#4f5bda] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950 focus:ring-[#5865F2] transition-colors"
                    >
                        <DiscordIcon className="w-5 h-5 mr-2 -ml-1" />
                        Entrar no Discord
                    </a>

                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Comunicados</h3>
                        <div className="space-y-1">
                            {announcements.length > 0 ? announcements.map(announcement => (
                                <AnnouncementItem key={announcement.id} post={announcement} />
                            )) : (
                                <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-4">Nenhum comunicado recente.</p>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
        {isNewPostModalOpen && (
            <NewPostModal
                user={user}
                onClose={() => setIsNewPostModalOpen(false)}
                onCreatePost={(postData) => {
                    onCreatePost(postData);
                    setIsNewPostModalOpen(false);
                }}
            />
        )}
    </div>
  );
};

export default CommunityView;