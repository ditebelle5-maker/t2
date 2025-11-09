import React, { useState } from 'react';
import type { User } from '../types';
import { ArrowLeftIcon, EmailIcon, LockClosedIcon, UserIcon } from './icons';

interface AuthPageProps {
  onLogin: (email: string, pass: string) => Promise<User | null>;
  onRegister: (name: string, email: string, pass: string) => Promise<User | null>;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, onBack }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLoginView) {
                if (!email || !password) {
                    setError('Por favor, preencha todos os campos.');
                    return;
                }
                const user = await onLogin(email, password);
                if (!user) {
                    setError('Email ou senha inválidos.');
                }
            } else {
                if (!name || !email || !password) {
                    setError('Por favor, preencha todos os campos.');
                    return;
                }
                if (password.length < 6) {
                    setError('A senha deve ter no mínimo 6 caracteres.');
                    return;
                }
                const user = await onRegister(name, email, password);
                if (!user) {
                    setError('Erro ao criar conta. Verifique se o email já está em uso.');
                }
            }
        } catch (err) {
            setError('Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };
    
    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden bg-zinc-950 p-4">
             <button 
                onClick={onBack} 
                className="absolute top-6 left-6 flex items-center px-3 py-2 text-sm font-medium text-zinc-300 bg-zinc-900/50 rounded-lg hover:bg-zinc-800/80 transition-colors z-20"
            >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Voltar
            </button>
            <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {isLoginView ? 'Bem-vindo de volta!' : 'Crie sua Conta'}
                </h2>
                <p className="text-zinc-300 mb-8">
                    {isLoginView ? 'Acesse sua conta para continuar.' : 'Comece sua jornada conosco.'}
                </p>

                {error && <p className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm p-3 rounded-lg mb-6">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    {!isLoginView && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                                Nome
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <UserIcon className="w-5 h-5 text-zinc-500" />
                                </span>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
                                    required 
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <EmailIcon className="w-5 h-5 text-zinc-500" />
                            </span>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
                                required 
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon className="w-5 h-5 text-zinc-500" />
                            </span>
                            <input 
                                type="password" 
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
                                required
                            />
                        </div>
                    </div>
                     <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-8 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:shadow-white/20 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Aguarde...' : (isLoginView ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

                <p className="mt-8 text-sm text-zinc-300">
                    {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button onClick={toggleView} className="font-semibold text-zinc-200 hover:text-white hover:underline ml-2 focus:outline-none focus:underline">
                        {isLoginView ? 'Cadastre-se' : 'Faça login'}
                    </button>
                </p>
            </div>
        </main>
    );
};

export default AuthPage;