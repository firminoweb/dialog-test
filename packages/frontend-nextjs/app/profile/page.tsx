'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Post } from '@/lib/types';
import { userApi, postApi } from '@/lib/api';
import ProfileHeader from '../components/profile/ProfileHeader';
import PostCard from '../components/post/PostCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id') || 'me';

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userResponse = userId === 'me' 
        ? await userApi.getCurrentUser()
        : await userApi.getUserById(userId);
      
      if (userResponse.success) {
        setUser(userResponse.data);
        
        const postsResponse = await postApi.getUserPosts(userResponse.data.id);
        if (postsResponse.success) {
          setPosts(postsResponse.data);
        }
      } else {
        setError('Falha ao carregar o perfil do usuário');
      }
    } catch (err) {
      setError('Ocorreu um erro ao carregar o perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-2 text-gray-500">Carregando perfil...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="p-6 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-red-400 mx-auto mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h2 className="text-xl font-semibold mb-4">{error || 'Usuário não encontrado'}</h2>
          <Button onClick={loadUserProfile}>
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="rounded-b-none shadow-sm mb-6">
        <ProfileHeader 
          user={user} 
          isEditable={userId === 'me'} 
          onEdit={handleEditProfile} 
        />
      </Card>
      
      <div className="max-w-2xl mx-auto px-4">
        {posts.length === 0 ? (
          <Card className="p-8 text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-300 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
            <p className="text-gray-500 mb-4">
              Este usuário ainda não publicou nada.
            </p>
            {userId === 'me' && (
              <Button onClick={() => window.location.href = '/'}>
                Criar sua primeira publicação
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={{...post, user}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
