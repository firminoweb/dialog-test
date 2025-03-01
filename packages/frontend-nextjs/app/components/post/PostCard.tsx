// app/components/post/PostCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { likeApi } from '@/lib/api';
import LikeButton from './LikeButton';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  
  const handleLike = async () => {
    if (isLiked) {
      // Lógica de unlike - simplificada para o exemplo
      setLikesCount(likesCount - 1);
      setIsLiked(false);
    } else {
      const response = await likeApi.likePost(post.id);
      if (response.success) {
        setLikesCount(likesCount + 1);
        setIsLiked(true);
        if (onLike) onLike(post.id);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
      <div className="flex items-center mb-3">
        <Link href={`/profile?id=${post.userId}`} className="flex items-center">
          <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
            {post.user?.avatar ? (
              <Image 
                src={post.user.avatar} 
                alt={post.user?.name || 'User'} 
                fill 
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
      
      <Link href={`/post/${post.id}`}>
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
      </Link>
      
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-1">
          <LikeButton isLiked={isLiked} onClick={handleLike} />
          <span className="text-sm text-gray-600">{likesCount}</span>
        </div>
      </div>
    </div>
  );
}
