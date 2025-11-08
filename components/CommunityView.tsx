import React from 'react';
import { DiscordIcon } from './icons';

const CommunityView: React.FC = () => {
  return (
    <div className="animate-fade-in h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-emerald-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-400"></div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        <a 
          href="https://discord.gg/example"
          target="_blank" 
          rel="noopener noreferrer"
          className="group block w-full p-8 sm:p-12 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-3xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-2xl hover:shadow-indigo-500/10"
        >
          <div className="flex flex-col items-center">
            <div className="mb-6 p-5 bg-zinc-800/50 rounded-full border border-zinc-700/80 transition-transform duration-300 group-hover:scale-110">
              <DiscordIcon className="w-16 h-16 text-[#5865F2]" />
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300 mb-4">
              Junte-se à nossa Comunidade
            </h3>

            <p className="text-zinc-400 max-w-md mx-auto mb-8 text-lg">
              Tire dúvidas, compartilhe seus projetos e conecte-se com outros membros e instrutores em nosso servidor oficial no Discord.
            </p>
            
            <div 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold text-base rounded-lg shadow-lg shadow-white/10 transition-all duration-300 group-hover:bg-zinc-200 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-white/20"
            >
              <span>Entrar no Servidor</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default CommunityView;