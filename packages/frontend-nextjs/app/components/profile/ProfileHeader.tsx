'use client';

import { useState } from 'react';
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
      <div className="h-48 bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-100 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center -mt-32 relative z-10">
          <div className="mr-6">
            <Avatar 
              src={user.avatar || '/images/default-avatar.png'} 
              alt={user.name} 
              size="xl" 
              className="border-4 border-white shadow-md" 
            />
          </div>

          <div className="mt-4 sm:mt-2 flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500">@{user.username}</p>
          </div>

          <div className="mt-4 sm:mt-2 flex items-center gap-2">
            {isEditable ? (
              <Button onClick={onEdit} variant="outline" className="shadow-sm border-gray-300">
                Editar Perfil
              </Button>
            ) : (
              <Button 
                onClick={handleFollowToggle} 
                variant={isFollowing ? "outline" : "primary"}
                className={isFollowing ? "shadow-sm border-gray-300" : "shadow-sm"}
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </Button>
            )}
          </div>
        </div>

        {user.bio && (
          <div className="mt-12">
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-400 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
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
              className="h-5 w-5 text-gray-400 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <span className="text-sm text-gray-600">
              Entrou em {new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="mt-8 border-b border-gray-200">
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
