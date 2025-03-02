// app/components/post/PostCard.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types';
import { likeApi } from '@/lib/api';
import LikeButton from './LikeButton';

interface PostCardProps {
  post: Post;
  isLiked?: boolean; // Agora recebemos de fora se o post já está curtido
  onLikeToggle?: (liked: boolean) => void; // Callback quando o status de like muda
}

export default function PostCard({ post, isLiked = false, onLikeToggle }: PostCardProps) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  
  // Atualizar o estado interno quando a prop isLiked mudar
  useEffect(() => {
    setIsLikedState(isLiked);
  }, [isLiked]);
  
  const handleLike = async (e?: React.MouseEvent) => {
    // Se o evento for fornecido, evitar propagação
    if (e) {
      e.stopPropagation();
    }
    
    if (isLiking) return; // Evitar múltiplos cliques
    
    setIsLiking(true);
    setLikeError(null);
    
    try {
      const userId = 'user123'; // Em uma aplicação real, viria da autenticação
      
      if (isLikedState) {
        // Lógica de unlike
        const likesResponse = await likeApi.getPostLikes(post.id);
        
        if (likesResponse.success) {
          const userLike = likesResponse.data.find(like => like.userId === userId);
          
          if (userLike) {
            const response = await likeApi.unlikePost(userLike.id);
            
            if (response.success) {
              setLikesCount(prev => Math.max(0, prev - 1));
              setIsLikedState(false);
              
              if (onLikeToggle) {
                onLikeToggle(false);
              }
            } else {
              setLikeError('Erro ao remover curtida');
            }
          }
        }
      } else {
        // Lógica de like
        const response = await likeApi.likePost(post.id, userId);
        
        if (response.success) {
          setLikesCount(prev => prev + 1);
          setIsLikedState(true);
          
          if (onLikeToggle) {
            onLikeToggle(true);
          }
        } else {
          console.error('Erro ao curtir post:', response.message);
          setLikeError(response.message || 'Erro ao curtir o post');
        }
      }
    } catch (error) {
      console.error('Erro ao processar curtida:', error);
      setLikeError('Falha ao processar a curtida');
    } finally {
      setIsLiking(false);
    }
  };

  // Wrapper function for LikeButton that doesn't expect parameters
  const handleLikeButtonClick = () => {
    handleLike();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    }).format(date);
  };

  const navigateToPost = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
      {/* Cabeçalho do post com perfil do usuário */}
      <div className="flex items-center mb-3">
        <Link href={`/profile?id=${post.userId}`} className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
            {post.user?.avatar ? (
              <Image 
                src={post.user.avatar} 
                alt={post.user?.name || 'User'} 
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{post.user?.name || 'Usuário'}</h3>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </Link>
      </div>
      
      {/* Conteúdo do post - clicável para navegar para a página do post */}
      <div 
        className="cursor-pointer" 
        onClick={navigateToPost}
      >
        <p className="mb-3">{post.content}</p>
        
        {post.imageUrl && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-3">
            <Image 
              src={post.imageUrl} 
              alt="Post image" 
              fill 
              className="object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Ações do post: like, etc */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-1">
          <LikeButton 
            isLiked={isLikedState} 
            onClick={handleLikeButtonClick} 
          />
          <span className={`text-sm ${isLiking ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLiking ? '...' : likesCount}
          </span>
        </div>
        
        {likeError && (
          <div className="text-xs text-red-500 mt-1">
            {likeError}
          </div>
        )}
      </div>
    </div>
  );
}
