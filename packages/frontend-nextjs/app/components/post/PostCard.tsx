'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types';
import { likeApi, postApi } from '@/lib/api';
import LikeButton from './LikeButton';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface PostCardProps {
  post: Post;
  isLiked?: boolean;
  onLikeToggle?: (liked: boolean) => void;
  isOwnPost?: boolean;
  onPostDeleted?: (postId: string) => void;
}

export default function PostCard({ 
  post, 
  isLiked = false, 
  onLikeToggle,
  isOwnPost = false,
  onPostDeleted
}: PostCardProps) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    setIsLikedState(isLiked);
  }, [isLiked]);
  
  const handleLike = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (isLiking) return;
    
    setIsLiking(true);
    setLikeError(null);
    
    try {
      const userId = 'user123';
      
      if (isLikedState) {
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

  const openDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      setIsVisible(false);
      setShowDeleteModal(false);
      
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }

      const response = await postApi.deletePost(post.id, 'user123');
      
      if (!response.success) {
        console.error('Erro ao excluir post:', response.message);
      }
    } catch (error) {
      console.error('Erro ao excluir post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-3">
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
          
          {isOwnPost && (
            <Button
              variant="ghost"
              size="sm"
              onClick={openDeleteModal}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              aria-label="Excluir post"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Excluindo
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </Button>
          )}
        </div>
        
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

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePost}
        title="Excluir publicação"
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger={true}
      >
        <div className="py-2">
          <p className="text-gray-700">
            Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita.
          </p>
        </div>
      </Modal>
    </>
  );
}
