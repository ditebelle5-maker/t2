import React, { useState, useEffect } from 'react';
import type { Video, User } from '../types';
import { PlusIcon, EditIcon, TrashIcon, CloseIcon, WarningIcon } from './icons';
import VideoEditModal from './VideoEditModal';

// Modal simplificado para a criação inicial do card
interface NewCardModalProps {
  onClose: () => void;
  onSave: (title: string, thumbnail: string) => void;
}

const NewCardModal: React.FC<NewCardModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor, insira um título para a aula.');
      return;
    }
    onSave(title, thumbnail);
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Criar Novo Card de Aula</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <CloseIcon className="text-gray-600 dark:text-white"/>
          </button>
        </div>
        <div className="p-6 space-y-4">
            <div>
                <label htmlFor="card-title" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Título do Card</label>
                <input id="card-title" type="text" placeholder="Ex: Introdução ao React" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" autoFocus/>
            </div>
            <div>
                <label htmlFor="card-thumbnail" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">URL da Miniatura (Thumbnail)</label>
                <input id="card-thumbnail" type="text" placeholder="https://exemplo.com/imagem.png" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
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
            onClick={handleSave} 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-500"
          >
            Criar Card
          </button>
        </div>
      </div>
    </div>
  );
};

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [inputValue, setInputValue] = useState('');
  const confirmationText = 'deletar';

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const isConfirmed = inputValue === confirmationText;

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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <WarningIcon className="w-6 h-6 text-red-500"/>
            Confirmar Exclusão
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <CloseIcon className="text-gray-600 dark:text-white"/>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-zinc-300">
            Você tem certeza que deseja excluir a aula <strong className="font-semibold text-gray-900 dark:text-white">"{itemName}"</strong>?
          </p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Esta ação é permanente e não pode ser desfeita.</p>
          <div className="pt-2">
            <label htmlFor="delete-confirm-input" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Para confirmar, digite <code className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">{confirmationText}</code> abaixo:
            </label>
            <input
              id="delete-confirm-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              autoFocus
            />
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
            onClick={onConfirm}
            disabled={!isConfirmed}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-red-500 disabled:bg-gray-300 dark:disabled:bg-zinc-800 disabled:text-gray-500 dark:disabled:text-zinc-500 disabled:cursor-not-allowed"
          >
            Excluir Permanentemente
          </button>
        </div>
      </div>
    </div>
  );
};


interface ContentViewProps {
  onVideoSelect: (video: Video, course: Video[], courseTitle: string) => void;
  courses: Record<string, Video[]>;
  user: User;
  addCourse: (title: string) => boolean;
  updateCourseTitle: (oldTitle: string, newTitle: string) => boolean;
  deleteCourse: (title: string) => void;
  addVideoToCourse: (courseTitle: string, videoData: Omit<Video, 'id'>) => void;
  updateVideoInCourse: (courseTitle: string, videoId: number, updatedData: Partial<Omit<Video, 'id'>>) => void;
  deleteVideoFromCourse: (courseTitle: string, videoId: number) => void;
}

const VideoCard: React.FC<{ 
  video: Video; 
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  user: User;
}> = ({ video, onSelect, onEdit, onDelete, user }) => {
  const isPlaceholder = video.videoUrl === '';

  const handleCardClick = () => {
    // If it's not a placeholder, anyone can select it.
    // If it IS a placeholder, only an admin can select it to navigate to the player view.
    if (!isPlaceholder || (isPlaceholder && user.role === 'admin')) {
      onSelect();
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`relative bg-white dark:bg-zinc-950 rounded-xl overflow-hidden group transition-all duration-300 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:-translate-y-1 border cursor-pointer flex flex-col shrink-0 w-48 animate-fade-in-up
        ${isPlaceholder && user.role === 'admin' ? 'border-dashed border-gray-400 dark:border-zinc-600' : 'border-solid border-gray-200 dark:border-zinc-800'}`}
    >
        <div className="relative w-full aspect-[9/16]">
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 m-2 px-1 py-0.5 text-[10px] font-bold text-white bg-black/60 rounded">
                {video.duration}
            </div>
        </div>
        <div className="p-3 flex-grow flex flex-col">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex-grow line-clamp-3">{video.title}</h3>
        </div>

        {user.role === 'admin' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button 
              onClick={handleEdit}
              className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
              aria-label="Editar aula"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-3 bg-zinc-900 rounded-full text-white hover:bg-red-600 transition-colors"
              aria-label="Excluir aula"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
    </div>
  );
};


const AddVideoCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div
        onClick={onClick}
        className="bg-white dark:bg-zinc-950 rounded-xl group transition-all duration-300 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:-translate-y-1 border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600 cursor-pointer flex flex-col shrink-0 w-48 aspect-[9/16] items-center justify-center text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-white animate-fade-in-up"
    >
        <PlusIcon className="w-8 h-8 mb-2 transition-transform group-hover:scale-110" />
        <span className="font-semibold text-sm">Adicionar Aula</span>
    </div>
);


const ContentView: React.FC<ContentViewProps> = ({ 
    onVideoSelect, 
    courses, 
    user, 
    addCourse, 
    updateCourseTitle,
    deleteCourse,
    addVideoToCourse, 
    updateVideoInCourse, 
    deleteVideoFromCourse 
}) => {
    const [editingVideo, setEditingVideo] = useState<{ courseTitle: string; video: Video } | null>(null);
    const [isNewCourseInputVisible, setIsNewCourseInputVisible] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCardCourseTitle, setNewCardCourseTitle] = useState<string | null>(null);
    const [editingCourse, setEditingCourse] = useState<string | null>(null);
    const [editedCourseName, setEditedCourseName] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<{ courseTitle: string; videoId: number; videoTitle: string } | null>(null);


    const openEditModal = (courseTitle: string, video: Video) => {
      setEditingVideo({ courseTitle, video });
    };
    
    const handleSaveVideo = (videoData: Omit<Video, 'id'>) => {
      if (editingVideo) {
          updateVideoInCourse(editingVideo.courseTitle, editingVideo.video.id, videoData);
          setEditingVideo(null);
      }
    };
    
    const handleSaveNewCard = (title: string, thumbnail: string) => {
        if (!newCardCourseTitle) return;

        const newVideoData: Omit<Video, 'id'> = {
            title,
            thumbnail: thumbnail || 'https://placehold.co/360x640/0c0a09/333333?text=Nova%0AAula',
            description: '',
            duration: '00:00',
            videoUrl: '', // Chave para identificar como um placeholder
        };

        addVideoToCourse(newCardCourseTitle, newVideoData);
        setNewCardCourseTitle(null);
    };

    const handleDeleteRequest = (courseTitle: string, videoId: number, videoTitle: string) => {
        setVideoToDelete({ courseTitle, videoId, videoTitle });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (videoToDelete) {
            deleteVideoFromCourse(videoToDelete.courseTitle, videoToDelete.videoId);
        }
        setIsDeleteModalOpen(false);
        setVideoToDelete(null);
    };
    
    const handleAddNewCourse = () => {
        if (newCourseName.trim()) {
            const success = addCourse(newCourseName.trim());
            if (success) {
                setNewCourseName('');
                setIsNewCourseInputVisible(false);
            }
        }
    };

    const handleEditCourseClick = (title: string) => {
        setEditingCourse(title);
        setEditedCourseName(title);
    };

    const handleCancelEditCourse = () => {
        setEditingCourse(null);
        setEditedCourseName('');
    };

    const handleSaveCourse = (oldTitle: string) => {
        if (editedCourseName.trim() && editedCourseName.trim() !== oldTitle) {
            const success = updateCourseTitle(oldTitle, editedCourseName.trim());
            if (success) {
                setEditingCourse(null);
            }
        } else {
            setEditingCourse(null);
        }
    };

    const handleDeleteCourse = (title: string) => {
        if (window.confirm(`Tem certeza que deseja excluir a categoria "${title}" e todas as suas aulas? Esta ação não pode ser desfeita.`)) {
            deleteCourse(title);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Meu Conteúdo</h2>

            {Object.keys(courses).length === 0 && !isNewCourseInputVisible ? (
                 <div className="text-center py-16 text-gray-500 dark:text-zinc-500">
                    <p>Nenhum curso foi adicionado ainda.</p>
                    {user.role === 'admin' && <p>Comece adicionando uma nova categoria abaixo.</p>}
                </div>
            ) : (
                Object.entries(courses).map(([courseTitle, videos]) => (
                    <section key={courseTitle}>
                        <div className="flex justify-between items-center mb-4">
                            {editingCourse === courseTitle ? (
                                <div className="flex items-center gap-2 flex-grow">
                                    <input
                                        type="text"
                                        value={editedCourseName}
                                        onChange={(e) => setEditedCourseName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveCourse(courseTitle);
                                            if (e.key === 'Escape') handleCancelEditCourse();
                                        }}
                                        className="flex-grow bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-2xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                    <button onClick={() => handleSaveCourse(courseTitle)} className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                                        Salvar
                                    </button>
                                    <button onClick={handleCancelEditCourse} className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{courseTitle}</h3>
                                    {user.role === 'admin' && (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEditCourseClick(courseTitle)} className="p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" title="Editar nome da categoria">
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDeleteCourse(courseTitle)} className="p-2 text-gray-500 dark:text-zinc-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" title="Excluir categoria">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
                            {Array.isArray(videos) && videos.length > 0 ? (
                                videos.map(video => (
                                    <VideoCard 
                                      key={video.id} 
                                      video={video} 
                                      user={user}
                                      onSelect={() => onVideoSelect(video, videos, courseTitle)}
                                      onEdit={() => openEditModal(courseTitle, video)}
                                      onDelete={() => handleDeleteRequest(courseTitle, video.id, video.title)}
                                    />
                                ))
                            ) : (
                                user.role !== 'admin' && <div className="pl-6 text-sm text-gray-500 dark:text-zinc-500 italic">Nenhuma aula nesta categoria ainda.</div>
                            )}
                             {user.role === 'admin' && (
                                <AddVideoCard onClick={() => setNewCardCourseTitle(courseTitle)} />
                            )}
                        </div>
                    </section>
                ))
            )}
            
            {user.role === 'admin' && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-zinc-800">
                    {isNewCourseInputVisible ? (
                        <div className="flex items-center gap-4 animate-fade-in">
                            <input
                                type="text"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                placeholder="Nome da nova categoria"
                                className="flex-grow bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <button 
                                onClick={handleAddNewCourse} 
                                className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Salvar Categoria
                            </button>
                            <button 
                                onClick={() => setIsNewCourseInputVisible(false)} 
                                className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsNewCourseInputVisible(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white bg-transparent border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-blue-500"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Adicionar Nova Categoria
                        </button>
                    )}
                </div>
            )}
            
            {newCardCourseTitle && (
                <NewCardModal
                    onClose={() => setNewCardCourseTitle(null)}
                    onSave={handleSaveNewCard}
                />
            )}

            {editingVideo && (
                <VideoEditModal
                    onClose={() => setEditingVideo(null)}
                    onSave={handleSaveVideo}
                    video={editingVideo.video}
                />
            )}

            {isDeleteModalOpen && videoToDelete && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemName={videoToDelete.videoTitle}
                />
            )}
        </div>
    );
};

export default ContentView;