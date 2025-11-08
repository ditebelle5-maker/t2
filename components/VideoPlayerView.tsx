import React, { useState, useEffect } from 'react';
import type { Video, User } from '../types';
import { ArrowLeftIcon, CheckIcon, EditIcon } from './icons';
import VideoEditModal from './VideoEditModal';

interface VideoPlayerViewProps {
  initialVideo: Video;
  playlist: Video[];
  onBack: () => void;
  user: User;
  updateVideoInCourse: (courseTitle: string, videoId: number, updatedData: Partial<Omit<Video, 'id'>>) => void;
  courseTitle: string;
}

const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({ initialVideo, playlist, onBack, user, updateVideoInCourse, courseTitle }) => {
  const [currentVideo, setCurrentVideo] = useState(initialVideo);
  const [playlistState, setPlaylistState] = useState(playlist);
  const [completedVideos, setCompletedVideos] = useState<Set<number>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setCurrentVideo(initialVideo);
    setPlaylistState(playlist);
  }, [initialVideo, playlist]);

  const handleToggleComplete = (videoId: number) => {
    const newCompleted = new Set(completedVideos);
    if (newCompleted.has(videoId)) {
      newCompleted.delete(videoId); // Allows un-checking if needed
    } else {
      newCompleted.add(videoId);
    }
    setCompletedVideos(newCompleted);
  };

  const handleSaveVideo = (videoData: Partial<Omit<Video, 'id'>>) => {
    // Call the parent function from App.tsx to update the global state
    updateVideoInCourse(courseTitle, currentVideo.id, videoData);

    // Update the local state to reflect changes immediately
    const updatedVideo = { ...currentVideo, ...videoData };
    setCurrentVideo(updatedVideo);
    setPlaylistState(prevPlaylist => 
        prevPlaylist.map(v => v.id === currentVideo.id ? updatedVideo : v)
    );

    setIsEditModalOpen(false);
  };
  
  const isCurrentVideoCompleted = completedVideos.has(currentVideo.id);
  const progressPercentage = playlistState.length > 0 ? (completedVideos.size / playlistState.length) * 100 : 0;

  return (
    <>
        <div className="animate-fade-in max-w-screen-2xl mx-auto">
          <div className="mb-6">
              <button 
                onClick={onBack} 
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Voltar para o Conteúdo
              </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
              {/* Main Content: Player and Description */}
              <div className="flex-grow lg:flex-[2] xl:flex-[3] space-y-6">
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                    <video 
                      key={currentVideo.id}
                      src={currentVideo.videoUrl} 
                      poster={currentVideo.thumbnail} 
                      controls 
                      autoPlay 
                      className="w-full h-full"
                    >
                      Seu navegador não suporta a tag de vídeo.
                    </video>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-zinc-400 mb-1">{courseTitle}</p>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{currentVideo.title}</h2>
                            <p className="text-base text-zinc-400 mt-2">Duração: {currentVideo.duration}</p>
                        </div>
                        <button 
                            onClick={() => handleToggleComplete(currentVideo.id)}
                            className={`flex items-center justify-center w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-lg shrink-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-green-500 ${
                                isCurrentVideoCompleted 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                            <CheckIcon className="w-5 h-5 mr-2" />
                            {isCurrentVideoCompleted ? 'Aula Concluída' : 'Marcar como Concluída'}
                        </button>
                    </div>
                    <div className="pt-4 border-t border-zinc-800">
                        <h3 className="font-semibold text-lg text-white mb-2">Sobre esta aula</h3>
                        <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {currentVideo.description || "Nenhuma descrição disponível para esta aula."}
                        </p>
                    </div>
                </div>
              </div>

              {/* Playlist */}
              <aside className="lg:w-[400px] xl:w-[450px] shrink-0">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 h-full flex flex-col" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                    <div className="flex justify-between items-center p-2.5 mb-2 shrink-0">
                        <h3 className="text-lg font-bold text-white">Aulas ({playlistState.length})</h3>
                        {user.role === 'admin' && (
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
                            >
                                <EditIcon className="w-4 h-4" />
                                Editar Aula
                            </button>
                        )}
                    </div>
                    <div className="space-y-1.5 flex-grow overflow-y-auto pr-1.5">
                      {playlistState.map((video) => {
                          const isCompleted = completedVideos.has(video.id);
                          const isActive = currentVideo.id === video.id;
                          return (
                          <button
                              key={video.id}
                              onClick={() => setCurrentVideo(video)}
                              className={`w-full text-left p-2 rounded-lg flex items-center gap-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ${
                              isActive ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'
                              }`}
                          >
                              <div className="relative w-28 aspect-video shrink-0">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover rounded-md" />
                                {isCompleted && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                    <CheckIcon className="w-6 h-6 text-green-400" />
                                  </div>
                                )}
                              </div>
                              <div className="overflow-hidden flex-grow">
                                  <p className={`font-semibold text-sm leading-tight ${isActive ? 'text-white' : 'text-zinc-200'}`}>{video.title}</p>
                                  <p className="text-xs text-zinc-400 mt-1">{video.duration}</p>
                              </div>
                          </button>
                          )
                      })}
                    </div>
                    <div className="mt-2 p-2.5 border-t border-zinc-800 shrink-0">
                        <p className="text-sm font-medium text-zinc-300 mb-2">Progresso do Curso</p>
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-zinc-800 rounded-full h-2">
                              <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out shadow-lg shadow-green-500/30" 
                                  style={{ width: `${progressPercentage}%` }}
                              ></div>
                          </div>
                          <span className="text-sm font-semibold text-zinc-400 w-12 text-right">{Math.round(progressPercentage)}%</span>
                        </div>
                    </div>
                </div>
              </aside>
          </div>
        </div>
        
        {isEditModalOpen && (
            <VideoEditModal
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveVideo}
                video={currentVideo}
            />
        )}
    </>
  );
};

export default VideoPlayerView;