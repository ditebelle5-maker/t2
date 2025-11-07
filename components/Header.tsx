import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800 shrink-0">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">R4 Academy</h1>
      </div>
    </header>
  );
};

export default Header;