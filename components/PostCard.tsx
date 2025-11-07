import React, { useState } from 'react';
import { HeartIcon, HeartIconSolid, PinIcon, ChatBubbleIcon, SendIcon } from './icons';
import type { User, Post, Comment } from '../types';

interface PostCardProps {
    post: Post;
    onLikeToggle: (id: number) => void;
    onPinToggle: (id: number) => void;
    onCreateComment: (postId: number, content: string) => void;
    currentUser: User;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex items-start space-x-3">
        <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
        <div className="flex-1">
            <div className="bg-gray-100 dark:bg-zinc-900 rounded-lg px-3 py-2">
                <div className="flex items-baseline space-x-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-zinc-100">{comment.author}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">{comment.time}</p>
                </div>
                <p className="text-sm text-gray-800 dark:text-zinc-200">{comment.content}</p>
            </div>
        </div>
    </div>
);

const PostCard: React.FC<PostCardProps> = ({ post, onLikeToggle, onPinToggle, onCreateComment, currentUser }) => {
    const [comment, setComment] = useState('');
    const [showComments, setShowComments] = useState(false);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            onCreateComment(post.id, comment);
            setComment('');
            if (!showComments) {
                setShowComments(true);
            }
        }
    };
    
    return (
        <div className={`bg-white dark:bg-zinc-950 p-5 rounded-xl border ${post.pinned ? 'border-yellow-500/50' : 'border-gray-200 dark:border-zinc-800'} animate-fade-in-up transition-colors`}>
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                    <div className="ml-3">
                        <p className="font-semibold text-gray-900 dark:text-zinc-100">{post.author}</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{post.time}</p>
                    </div>
                </div>
                {post.pinned && (
                    <div className="flex items-center text-yellow-500 text-xs font-semibold">
                        <PinIcon className="w-4 h-4 mr-1.5" />
                        <span>FIXADO</span>
                    </div>
                )}
            </div>
            
            {/* Post Content */}
            <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-zinc-100">{post.title}</h4>
            {post.content && <p className="text-gray-700 dark:text-zinc-300 whitespace-pre-wrap">{post.content}</p>}
            
            {/* Post Images */}
            {post.imageUrls && post.imageUrls.length > 0 && (
                 <div className={`mt-4 grid gap-2 ${
                    post.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                } ${
                    post.imageUrls.length === 3 ? '[&>*:first-child]:col-span-2' : ''
                }`}>
                    {post.imageUrls.map((url, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                           <img 
                                src={url} 
                                alt={`Anexo ${index + 1} da publicação`} 
                                className={`w-full object-cover ${post.imageUrls?.length === 3 && index === 0 ? 'aspect-video' : 'aspect-square'}`}
                            />
                       </div>
                   ))}
                </div>
            )}

            {/* Actions: Like, Comment, Pin */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => onLikeToggle(post.id)}
                        className={`flex items-center text-sm transition-colors p-1 -m-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${post.liked ? 'text-red-500 hover:text-red-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white'}`}
                    >
                        {post.liked ? <HeartIconSolid className="w-5 h-5 mr-1.5" /> : <HeartIcon className="w-5 h-5 mr-1.5" />}
                        {post.likes}
                    </button>
                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white transition-colors p-1 -m-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <ChatBubbleIcon className="w-5 h-5 mr-1.5" />
                        {post.comments?.length || 0}
                    </button>
                </div>

                {currentUser.role === 'admin' && (
                    <button
                        onClick={() => onPinToggle(post.id)}
                        className="flex items-center text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white p-1 -m-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        title={post.pinned ? 'Desafixar Recado' : 'Fixar Recado'}
                    >
                        <PinIcon className={`w-5 h-5 transition-colors ${post.pinned ? 'text-yellow-500' : 'text-zinc-500 hover:text-yellow-500'}`} />
                    </button>
                )}
            </div>

            {/* Comments Section */}
            {(showComments || (post.comments && post.comments.length > 0)) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800 space-y-4">
                    {showComments && post.comments && post.comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                     <form onSubmit={handleCommentSubmit} className="flex items-start space-x-3">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Adicione um comentário..."
                                className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-full pl-4 pr-10 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            <button
                                type="submit"
                                disabled={!comment.trim()}
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed transition-colors"
                                aria-label="Enviar comentário"
                            >
                                <SendIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default PostCard;
