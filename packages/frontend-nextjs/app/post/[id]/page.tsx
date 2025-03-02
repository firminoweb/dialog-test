'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Post, Like } from '@/lib/types';
import { postApi, likeApi } from '@/lib/api';
import Card from '@/app/components/ui/Card';
import Avatar from '@/app/components/ui/Avatar';
import Button from '@/app/components/ui/Button';
import LikeButton from '@/app/components/post/LikeButton';

const CURRENT_USER_ID = 'user123';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function PostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = params?.id;

  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLike, setUserLike] = useState<Like | null>(null);

  useEffect(() => {
    if (postId) {
      loadPostDetails();
    }
  }, [postId]);

  const loadPostDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const postResponse = await postApi.getPostById(postId);
      
      if (postResponse.success) {
        setPost(postResponse.data);
        
        const likesResponse = await likeApi.getPostLikes(postId);
        if (likesResponse.success) {
          setLikes(likesResponse.data);
          
          const userLikeObj = likesResponse.data.find(like => like.userId === CURRENT_USER_ID);
          setUserLike(userLikeObj || null);
          setIsLiked(!!userLikeObj);
          
          console.log('Post carregado:', postResponse.data);
          console.log('Likes do post:', likesResponse.data);
          console.log('Like do usuário:', userLikeObj);
        }
      } else {
        setError('Falha ao carregar o post');
      }
    } catch (err) {
      setError('Ocorreu um erro ao carregar o post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!post) return;
    
    try {
      if (isLiked && userLike) {
        const response = await likeApi.unlikePost(userLike.id);
        
        if (response.success) {
          setUserLike(null);
          setIsLiked(false);
          setLikes(likes.filter(like => like.id !== userLike.id));
          setPost({
            ...post,
            likesCount: Math.max(0, post.likesCount - 1)
          });
        } else {
          console.error('Erro ao remover curtida:', response.message);
        }
      } else {

        const response = await likeApi.likePost(post.id, CURRENT_USER_ID);
        
        if (response.success) {

          const newLike = response.data;
          setUserLike(newLike);
          setIsLiked(true);
          setLikes([...likes, newLike]);
          setPost({
            ...post,
            likesCount: post.likesCount + 1
          });
        } else {
          console.error('Erro ao curtir post:', response.message);
        }
      }
    } catch (err) {
      console.error('Erro ao processar curtida:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-2 text-gray-500">Carregando post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="text-center py-8">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-gray-400 mx-auto mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Post não encontrado</h2>
          <p className="text-gray-600 mb-6">{error || 'Não foi possível encontrar o post solicitado.'}</p>
          <Button onClick={() => router.push('/')}>
            Voltar para a Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Voltar
        </Button>
      </div>

      <Card className="mb-8">
        {/* Cabeçalho do Post */}
        <div className="flex items-start mb-4">
          <Link href={`/profile?id=${post.userId}`} className="mr-3">
            <Avatar 
              src={post.user?.avatar || '/images/default-avatar.png'} 
              alt={post.user?.name || 'Usuário'} 
              size="md"
            />
          </Link>
          <div className="flex-1">
            <Link href={`/profile?id=${post.userId}`}>
              <h3 className="font-semibold text-gray-900">{post.user?.name || 'Usuário'}</h3>
              <p className="text-sm text-gray-500">@{post.user?.username || 'usuario'}</p>
            </Link>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Conteúdo do Post */}
        <div className="mb-6">
          <p className="text-gray-800 whitespace-pre-line mb-4">{post.content}</p>
          
          {post.imageUrl && (
            <div className="relative rounded-lg overflow-hidden my-4 max-h-96">
              <Image 
                src={post.imageUrl} 
                alt="Imagem do post" 
                width={600}
                height={400}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Métricas do Post */}
        <Card.Footer className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LikeButton isLiked={isLiked} onClick={() => handleLikeToggle()} />
            <span className="text-sm text-gray-600">{post.likesCount} curtidas</span>
          </div>
          
          <div>
            <button 
              className="
                flex items-center
                font-medium transition duration-150 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                bg-transparent hover:bg-gray-100 text-gray-700
                text-xs px-3 py-1.5 rounded
                text-gray-500
              "
              onClick={() => {
                const shareURL = `${window.location.origin}/post/${post.id}`;
                navigator.clipboard.writeText(shareURL).then(() => {
                  alert('Link copiado para a área de transferência!');
                });
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
                />
              </svg>
              Compartilhar
            </button>
          </div>
        </Card.Footer>
      </Card>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Comentários</h3>
        <Card padding="lg" className="text-center py-8 text-gray-500">
          Comentários serão implementados em uma fase futura do projeto.
        </Card>
      </div>
    </main>
  );
}
