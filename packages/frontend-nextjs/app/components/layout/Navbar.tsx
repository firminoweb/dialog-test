'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Avatar from '../ui/Avatar';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-6 h-6 mr-2"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M7 13a1 1 0 011-1h8a1 1 0 010 2H8a1 1 0 01-1-1z" />
              <path d="M10 9a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1z" />
              <path d="M10 17a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1z" />
            </svg>
            Social Feed
          </Link>

          {/* Menu para Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium ${isActive('/') 
                ? 'text-blue-600' 
                : 'text-gray-700 hover:text-blue-600'}`}
            >
              Home
            </Link>
            <Link 
              href="/profile?id=me" 
              className={`text-sm font-medium ${pathname.startsWith('/profile') 
                ? 'text-blue-600' 
                : 'text-gray-700 hover:text-blue-600'}`}
            >
              Perfil
            </Link>
            <Link href="/profile?id=me">
              <Avatar 
                src="https://i.pravatar.cc/150?img=8" 
                alt="Perfil" 
                size="sm" 
              />
            </Link>
          </nav>

          {/* Botão de menu para Mobile */}
          <button 
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t mt-3">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className={`block py-2 px-4 rounded-md ${isActive('/') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile?id=me" 
                  className={`block py-2 px-4 rounded-md ${pathname.startsWith('/profile') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Perfil
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
