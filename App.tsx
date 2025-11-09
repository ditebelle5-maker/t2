import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AgentView from './components/AgentView';
import ContentView from './components/ContentView';
import CommunityView from './components/CommunityView';
import VideoPlayerView from './components/VideoPlayerView';
import AdminView from './components/AdminView';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { supabase } from './lib/supabase';
import type { ViewType, Video, User, HistoryItem, AgentType, ChatHistory, SelectedCourseData } from './types';

const initialCourses: Record<string, Video[]> = {
  "Frontend Essencial": [
    { id: 1, title: "Introdução ao React com TypeScript", description: "Aprenda os conceitos básicos do React e como usá-lo com TypeScript para criar aplicações robustas.", duration: "15:30", thumbnail: "https://picsum.photos/seed/react/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d1/download" },
    { id: 2, title: "Estilização com Tailwind CSS", description: "Descubra como estilizar suas aplicações de forma rápida e eficiente com Tailwind CSS.", duration: "22:10", thumbnail: "https://picsum.photos/seed/tailwind/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d2/download" },
    { id: 3, title: "Hooks Avançados: useCallback e useMemo", description: "Otimize o desempenho de seus componentes com os hooks useCallback e useMemo.", duration: "18:45", thumbnail: "https://picsum.photos/seed/hooks/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d3/download" },
    { id: 4, title: "Gerenciamento de Estado com Zustand", description: "Aprenda a gerenciar o estado global de suas aplicações de forma simples e poderosa com Zustand.", duration: "12:05", thumbnail: "https://picsum.photos/seed/zustand/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d4/download" },
  ],
  "Backend & APIs": [
    { id: 5, title: "Criando APIs com Node.js e Express", description: "Desenvolvemos APIs RESTful robustas e escaláveis utilizando Node.js e o framework Express.", duration: "35:15", thumbnail: "https://picsum.photos/seed/nodejs/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d5/download" },
    { id: 6, title: "Banco de Dados com Prisma", description: "Simplifique o acesso e a manipulação de bancos de dados em suas aplicações Node.js com o Prisma ORM.", duration: "28:50", thumbnail: "https://picsum.photos/seed/prisma/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d6/download" },
    { id: 7, title: "Autenticação com JWT", description: "Implemente um sistema de autenticação seguro em suas APIs utilizando JSON Web Tokens (JWT).", duration: "19:20", thumbnail: "https://picsum.photos/seed/jwt/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d7/download" },
    { id: 8, title: "GraphQL para iniciantes", description: "Descubra uma nova forma de construir e consumir APIs com a linguagem de consulta GraphQL.", duration: "25:00", thumbnail: "https://picsum.photos/seed/graphql/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d9/download" },
  ],
  "Ferramentas e DevOps": [
    { id: 9, title: "Deploy na Vercel", description: "Aprenda a fazer deploy de suas aplicações frontend de forma simples e rápida com a Vercel.", duration: "10:00", thumbnail: "https://picsum.photos/seed/vercel/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d8/download" },
    { id: 10, title: "Introdução ao Docker", description: "Containerize suas aplicações com Docker para garantir consistência entre os ambientes de desenvolvimento e produção.", duration: "20:30", thumbnail: "https://picsum.photos/seed/docker/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5da/download" },
    { id: 11, title: "CI/CD com Github Actions", description: "Automatize o processo de build, teste e deploy de suas aplicações com Github Actions.", duration: "17:45", thumbnail: "https://picsum.photos/seed/githubactions/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5db/download" },
    { id: 12, title: "Versionamento com Git e Github", description: "Domine o sistema de controle de versão mais popular do mundo e colabore em projetos de forma eficiente.", duration: "22:00", thumbnail: "https://picsum.photos/seed/git/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5dc/download" },
  ],
};

const initialUsers: User[] = [
    { name: 'Admin', email: 'admin@email.com', avatar: 'https://i.pravatar.cc/150?u=user-admin', role: 'admin', online: true, warned: false, canPost: true },
    { name: 'Ana Clara', email: 'ana@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", role: 'admin', online: true, warned: false, canPost: true },
    { name: 'Bruno Costa', email: 'bruno@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e", role: 'admin', online: false, warned: false, canPost: true },
    { name: "Daniel Alves", email: 'daniel@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g", role: 'user', online: true, warned: true, canPost: false },
    { name: "Felipe Souza", email: 'felipe@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704i", role: 'user', online: false, warned: false, canPost: false },
    { name: "Carla Dias", email: 'carla@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f", role: 'user', online: true, warned: false, canPost: true },
    { name: "joão coelho gomes", email: 'umunsaad090@gmail.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a", role: 'admin', online: false, warned: false, canPost: true },
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activeView, setActiveView] = useState<ViewType>('conteudo');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourseData, setSelectedCourseData] = useState<SelectedCourseData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [courses, setCourses] = useState<Record<string, Video[]>>(initialCourses);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAppState('landing');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadAllUsers();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles_with_email')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const userProfile: User = {
          name: data.name,
          email: data.email || '',
          avatar: data.avatar,
          role: data.role,
          online: data.online,
          warned: data.warned,
          canPost: data.can_post
        };
        setUser(userProfile);
        setAppState('dashboard');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const loadAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles_with_email')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const usersList: User[] = data.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email || '',
          avatar: profile.avatar,
          role: profile.role,
          online: profile.online,
          warned: profile.warned,
          canPost: profile.can_post
        }));
        setUsers(usersList);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleVideoSelect = (video: Video, playlist: Video[], courseTitle: string) => {
    setSelectedCourseData({ video, playlist, courseTitle });
  };
  
  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setSelectedCourseData(null); // Reset video player when changing main view
  };

  const handleLogin = async (email: string, password: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login:', error.message);
        return null;
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return user;
      }

      return null;
    } catch (error) {
      console.error('Erro no login:', error);
      return null;
    }
  };

  const handleRegister = async (name: string, email: string, password: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar: `https://i.pravatar.cc/150?u=${email}`
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error.message);
        return null;
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return user;
      }

      return null;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAppState('landing');
      setActiveView('conteudo');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistory(prev => [
      { 
        ...item, 
        id: Date.now(), 
        timestamp: new Date().toISOString() 
      }, 
      ...prev
    ]);
  };

  const deleteHistoryItem = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearAgentHistory = (agentType: AgentType) => {
    setHistory(prev => prev.filter(item => item.agentType !== agentType));
  };
  
  const saveChatHistory = (chatToSave: ChatHistory) => {
    setChatHistories(prev => {
      const existingIndex = prev.findIndex(c => c.id === chatToSave.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = chatToSave;
        return updated;
      }
      return [chatToSave, ...prev];
    });
  };

  const deleteChatHistory = (id: number) => {
    setChatHistories(prev => prev.filter(c => c.id !== id));
  };

  const clearAllChatHistory = () => {
    setChatHistories([]);
  };

  // Course Management
  const addCourse = (title: string) => {
    if (courses[title]) {
      alert('Um curso com este nome já existe.');
      return false;
    }
    setCourses(prev => ({ ...prev, [title]: [] }));
    return true;
  };
  
  const updateCourseTitle = (oldTitle: string, newTitle: string) => {
    if (courses[newTitle] && oldTitle !== newTitle) {
       alert('Um curso com este nome já existe.');
       return false;
    }
    setCourses(prev => {
      const newCourses = { ...prev };
      const videos = newCourses[oldTitle];
      delete newCourses[oldTitle];
      newCourses[newTitle] = videos;
      return newCourses;
    });
    return true;
  };
  
  const deleteCourse = (title: string) => {
    setCourses(prev => {
      const newCourses = { ...prev };
      delete newCourses[title];
      return newCourses;
    });
  };

  // Video Management
  const addVideoToCourse = (courseTitle: string, videoData: Omit<Video, 'id'>) => {
    setCourses(prev => ({
      ...prev,
      [courseTitle]: [
        ...prev[courseTitle],
        { ...videoData, id: Date.now() }
      ]
    }));
  };
  
  const updateVideoInCourse = (courseTitle: string, videoId: number, updatedData: Partial<Omit<Video, 'id'>>) => {
    setCourses(prev => ({
      ...prev,
      [courseTitle]: prev[courseTitle].map(video =>
        video.id === videoId ? { ...video, ...updatedData } : video
      )
    }));
  };
  
  const deleteVideoFromCourse = (courseTitle: string, videoId: number) => {
    setCourses(prev => ({
      ...prev,
      [courseTitle]: prev[courseTitle].filter(video => video.id !== videoId)
    }));
  };

  // User Management
  const toggleUserWarning = async (userId: string) => {
    try {
      const targetUser = users.find(u => u.email === userId);
      if (!targetUser) return;

      const { error } = await supabase
        .from('profiles')
        .update({ warned: !targetUser.warned })
        .eq('id', userId);

      if (error) throw error;
      await loadAllUsers();
    } catch (error) {
      console.error('Erro ao atualizar warning:', error);
    }
  };

  const toggleUserCanPost = async (userId: string) => {
    try {
      const targetUser = users.find(u => u.email === userId);
      if (!targetUser) return;

      const { error } = await supabase
        .from('profiles')
        .update({ can_post: !targetUser.canPost })
        .eq('id', userId);

      if (error) throw error;
      await loadAllUsers();
    } catch (error) {
      console.error('Erro ao atualizar permissão:', error);
    }
  };

  const banUser = async (userId: string) => {
    try {
      const { data: { user: currentAuthUser } } = await supabase.auth.getUser();
      if (currentAuthUser?.id === userId) {
        alert("Você não pode banir a si mesmo.");
        return;
      }

      if (window.confirm(`Tem certeza que deseja banir este usuário? Esta ação é permanente.`)) {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) throw error;
        await loadAllUsers();
      }
    } catch (error) {
      console.error('Erro ao banir usuário:', error);
    }
  };

  const renderDashboard = () => {
    if (!user) return null;

    if (selectedCourseData) {
      return (
        <VideoPlayerView 
          initialVideo={selectedCourseData.video} 
          playlist={selectedCourseData.playlist}
          onBack={() => setSelectedCourseData(null)} 
          user={user}
          updateVideoInCourse={updateVideoInCourse}
          courseTitle={selectedCourseData.courseTitle}
        />
      );
    }
    
    switch (activeView) {
      case 'agentes':
        return <AgentView 
                  history={history} 
                  addToHistory={addToHistory}
                  deleteHistoryItem={deleteHistoryItem}
                  clearAgentHistory={clearAgentHistory}
                  chatHistories={chatHistories}
                  saveChatHistory={saveChatHistory}
                  deleteChatHistory={deleteChatHistory}
                  clearAllChatHistory={clearAllChatHistory}
               />;
      case 'conteudo':
        return <ContentView 
                  onVideoSelect={handleVideoSelect} 
                  courses={courses} 
                  user={user}
                  addCourse={addCourse}
                  updateCourseTitle={updateCourseTitle}
                  deleteCourse={deleteCourse}
                  addVideoToCourse={addVideoToCourse}
                  updateVideoInCourse={updateVideoInCourse}
                  deleteVideoFromCourse={deleteVideoFromCourse}
               />;
      case 'comunidade':
        return <CommunityView />;
      case 'admin':
        return <AdminView 
                  users={users}
                  onBanUser={banUser}
                  currentUser={user}
               />;
      default:
        return <ContentView 
                  onVideoSelect={handleVideoSelect} 
                  courses={courses} 
                  user={user}
                  addCourse={addCourse}
                  updateCourseTitle={updateCourseTitle}
                  deleteCourse={deleteCourse}
                  addVideoToCourse={addVideoToCourse}
                  updateVideoInCourse={updateVideoInCourse}
                  deleteVideoFromCourse={deleteVideoFromCourse}
                />;
    }
  };
  
  if (appState === 'landing') {
    return <LandingPage onEnter={() => setAppState('auth')} />;
  }
  
  if (appState === 'auth') {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} onBack={() => setAppState('landing')} />;
  }
  
  if (appState === 'dashboard' && user) {
    return (
      <div className="relative flex h-screen bg-zinc-950 text-zinc-200 font-sans">
        <Sidebar 
          activeView={activeView} 
          setActiveView={handleViewChange}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          user={user}
          setUser={setUser}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-900 p-6 lg:p-8">
            {renderDashboard()}
          </main>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return <div>Carregando...</div>; // Fallback
};

export default App;