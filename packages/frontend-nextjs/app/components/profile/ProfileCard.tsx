// app/components/profile/ProfileCard.tsx
'use client';

import Image from 'next/image';
import { User } from '@/lib/types';

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <div className="w-24 h-24 relative rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
          {user.avatar ? (
            <Image 
              src={user.avatar} 
              alt={user.name} 
              fill 
              className="object-cover"
            />
          ) : (
            <Image 
              src="/images/default-avatar.png" 
              alt={user.name} 
              fill 
              className="object-cover"
            />
          )}
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500 mb-2">@{user.username}</p>
          
          {user.bio && (
            <p className="text-gray-700 mt-2">{user.bio}</p>
          )}
          
          <div className="mt-3 text-sm text-gray-500">
            Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
}
