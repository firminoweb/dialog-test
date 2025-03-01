// app/components/profile/ProfileHeader.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from '@/lib/types';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

interface ProfileHeaderProps {
  user: User;
  isEditable?: boolean;
  onEdit?: () => void;
}

export default function ProfileHeader({ user, isEditable = false, onEdit }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="relative">
      {/* Banner de capa */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg overflow-hidden relative">
        {/* Se tiver imagem de capa, exibir aqui */}
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 relative z-10">
          {/* Avatar do usuário */}
          <div className="mr-4">
            <Avatar 
              src={user.avatar || '/images/default-avatar.png'} 
              alt={user.name} 
              size="xl" 
              className="border-4 border-white" 
            />
          </div>

          {/* Informações do usuário */}
          <div className="mt-4 sm:mt-0 flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">@{user.username}</p>
          </div>

          {/* Botões de ação */}
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            {isEditable ? (
              <Button onClick={onEdit} variant="outline">
                Editar Perfil
              </Button>
            ) : (
              <Button 
                onClick={handleFollowToggle} 
                variant={isFollowing ? "outline" : "primary"}
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </Button>
            )}
          </div>
        </div>

        {/* Bio do usuário */}
        {user.bio && (
          <div className="mt-6">
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}

        {/* Estatísticas e info adicional */}
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-500 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            <span className="text-sm text-gray-600">
              248 seguidores
            </span>
          </div>
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-500 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <span className="text-sm text-gray-600">
              Entrou em {new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Tabs de navegação (poderia ser expandido) */}
        <div className="mt-8 border-b">
          <div className="flex space-x-8">
            <button className="pb-4 font-medium text-blue-600 border-b-2 border-blue-600">
              Posts
            </button>
            <button className="pb-4 font-medium text-gray-500 hover:text-gray-700">
              Curtidas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
