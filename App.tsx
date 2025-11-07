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
import type { ViewType, Video, User, HistoryItem, AgentType, ChatHistory, Post, SelectedCourseData, Theme, Comment } from './types';

const initialCourses: Record<string, Video[]> = {
  "Frontend Essencial": [
    { id: 1, title: "Introdução ao React com TypeScript", description: "Aprenda os conceitos básicos do React e como usá-lo com TypeScript para criar aplicações robustas.", duration: "15:30", thumbnail: "https://picsum.photos/seed/react/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d1/download" },
    { id: 2, title: "Estilização com Tailwind CSS", description: "Descubra como estilizar suas aplicações de forma rápida e eficiente com Tailwind CSS.", duration: "22:10", thumbnail: "https://picsum.photos/seed/tailwind/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d2/download" },
    { id: 3, title: "Hooks Avançados: useCallback e useMemo", description: "Otimize o desempenho de seus componentes com os hooks useCallback e useMemo.", duration: "18:45", thumbnail: "https://picsum.photos/seed/hooks/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d3/download" },
    { id: 4, title: "Gerenciamento de Estado com Zustand", description: "Aprenda a gerenciar o estado global de suas aplicações de forma simples e poderosa com Zustand.", duration: "12:05", thumbnail: "https://picsum.photos/seed/zustand/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d4/download" },
  ],
  "Backend & APIs": [
    { id: 5, title: "Criando APIs com Node.js e Express", description: "Desenvolva APIs RESTful robustas e escaláveis utilizando Node.js e o framework Express.", duration: "35:15", thumbnail: "https://picsum.photos/seed/nodejs/360/640", videoUrl: "https://dummyjson.com/video/60e52f5a689d1b0015e4a5d5/download" },
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

const initialPosts: Post[] = [
    { 
        id: 2,
        title: "Novas Aulas!",
        author: "Admin", 
        content: "Novas aulas sobre 'Backend & APIs' foram adicionadas! Confiram o módulo sobre autenticação com JWT, está imperdível.",
        time: "5 horas atrás",
        avatar: "https://i.pravatar.cc/150?u=user-admin",
        likes: 28,
        liked: true,
        pinned: true,
        comments: [
            { id: 1, author: "Carla Dias", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f", content: "Ótima notícia! Ansiosa para ver o conteúdo de JWT.", time: "4 horas atrás" },
            { id: 2, author: "Bruno Costa", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e", content: "Finalmente! Estava esperando por isso.", time: "3 horas atrás" },
        ]
    },
    { 
        id: 1,
        title: "Bem-vindos!",
        author: "Admin", 
        content: "Olá pessoal! Bem-vindos à nova plataforma. Fiquem à vontade para explorar os cursos na seção de Conteúdo. Em breve teremos mais novidades!",
        time: "2 horas atrás",
        avatar: "https://i.pravatar.cc/150?u=user-admin",
        likes: 12,
        liked: false,
        pinned: false,
        comments: [],
    },
];

const initialUsers: User[] = [
    { name: 'Admin', email: 'admin@email.com', avatar: 'https://i.pravatar.cc/150?u=user-admin', role: 'admin', online: true, warned: false, canPost: true },
    { name: 'Ana Clara', email: 'ana@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", role: 'admin', online: true, warned: false, canPost: true },
    { name: 'Bruno Costa', email: 'bruno@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e", role: 'admin', online: false, warned: false, canPost: true },
    { name: "Daniel Alves", email: 'daniel@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g", role: 'user', online: true, warned: true, canPost: false },
    { name: "Felipe Souza", email: 'felipe@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704i", role: 'user', online: false, warned: false, canPost: false },
    { name: "Carla Dias", email: 'carla@email.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f", role: 'user', online: true, warned: false, canPost: true },
    { name: "joão coelho gomes", email: 'umunsaad090@gmail.com', avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a", role: 'admin', online: false, warned: false, canPost: true },
];

const sortedInitialPosts = initialPosts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.id - a.id;
});

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activeView, setActiveView] = useState<ViewType>('conteudo');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourseData, setSelectedCourseData] = useState<SelectedCourseData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [courses, setCourses] = useState<Record<string, Video[]>>(initialCourses);
  const [posts, setPosts] = useState<Post[]>(sortedInitialPosts);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (currentTheme: Theme) => {
      const isDark = currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);


  const handleVideoSelect = (video: Video, playlist: Video[], courseTitle: string) => {
    setSelectedCourseData({ video, playlist, courseTitle });
  };
  
  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setSelectedCourseData(null); // Reset video player when changing main view
  };

  const handleLogin = (email: string, pass: string): User | null => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    // In a real app, you'd check a hashed password. For this demo, any password will do if the user exists.
    if (foundUser) {
        setUser(foundUser);
        setAppState('dashboard');
        return foundUser;
    }
    return null;
  };

  const handleRegister = (name: string, email: string, pass: string): User | null => {
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          return null; // User already exists
      }
      const newUser: User = {
          name,
          email,
          avatar: `https://i.pravatar.cc/150?u=${email}`, // Simple unique avatar
          role: 'user',
          canPost: true,
          online: true,
      };
      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      setAppState('dashboard');
      return newUser;
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('landing');
    setActiveView('conteudo'); // Reset to default view
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

  // Post Management
  const handleLikeToggle = (postId: number) => {
    setPosts(posts.map(post => 
        post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handlePinToggle = (postId: number) => {
      setPosts(prevPosts => {
          const updatedPosts = prevPosts.map(p =>
              p.id === postId ? { ...p, pinned: !p.pinned } : p
          );

          return updatedPosts.sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return b.id - a.id;
          });
      });
  };

  const handleCreatePost = (postData: { title: string; content: string; imageUrls?: string[] }) => {
      if (!user) return;
      const newPost: Post = {
          id: Date.now(),
          title: postData.title,
          author: user.name,
          avatar: user.avatar,
          content: postData.content,
          imageUrls: postData.imageUrls,
          time: "agora mesmo",
          likes: 0,
          liked: false,
          pinned: false,
          comments: [],
      };
      setPosts(prevPosts => [newPost, ...prevPosts].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.id - a.id;
    }));
  };

  const updatePost = (postId: number, postData: { title: string; content: string }) => {
    setPosts(prev => prev.map(p => 
        p.id === postId 
        ? { ...p, title: postData.title, content: postData.content } 
        : p
    ));
  };

  const deletePost = (postId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este comunicado?')) {
        setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  // Comment Management
  const handleCreateComment = (postId: number, content: string) => {
    if (!user) return;
    const newComment: Comment = {
      id: Date.now(),
      author: user.name,
      avatar: user.avatar,
      content: content,
      time: "agora mesmo",
    };
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments ? [...post.comments, newComment] : [newComment];
        return { ...post, comments: updatedComments };
      }
      return post;
    }));
  };

  // User Management
  const toggleUserWarning = (email: string) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, warned: !u.warned } : u));
  };
  
  const toggleUserCanPost = (email: string) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, canPost: !u.canPost } : u));
  };

  const deleteUser = (email: string) => {
    if (user?.email === email) {
      alert("Você não pode remover a si mesmo.");
      return;
    }
    if (window.confirm(`Tem certeza que deseja banir o usuário ${email}? Esta ação é permanente.`)) {
        setUsers(prev => prev.filter(u => u.email !== email));
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
          addVideoToCourse={addVideoToCourse}
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
        return <CommunityView 
                  user={user}
                  posts={posts}
                  handleLikeToggle={handleLikeToggle}
                  handlePinToggle={handlePinToggle}
                  allUsers={users}
                  onCreatePost={handleCreatePost}
                  onCreateComment={handleCreateComment}
                />;
      case 'admin':
        return <AdminView 
                  posts={posts} 
                  onCreatePost={handleCreatePost}
                  onUpdatePost={updatePost}
                  onDeletePost={deletePost}
                  users={users}
                  onToggleUserWarning={toggleUserWarning}
                  onDeleteUser={deleteUser}
                  onToggleUserCanPost={toggleUserCanPost}
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
      <div className="flex h-screen bg-white dark:bg-black text-gray-800 dark:text-zinc-200 font-sans">
        <Sidebar 
          activeView={activeView} 
          setActiveView={handleViewChange}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          user={user}
          setUser={setUser}
          onLogout={handleLogout}
          theme={theme}
          setTheme={setTheme}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-black p-6 lg:p-8">
            {renderDashboard()}
          </main>
        </div>
      </div>
    );
  }

  return <div>Carregando...</div>; // Fallback
};

export default App;