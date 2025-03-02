'use client';

import { useEffect, useState } from 'react';
import { Post, Like } from '@/lib/types';
import { postApi, likeApi } from '@/lib/api';
import PostCard from './components/post/PostCard';
import PostForm from './components/post/PostForm';

const CURRENT_USER_ID = 'user123';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userLikes, setUserLikes] = useState<{[postId: string]: Like}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await postApi.getPosts();
      
      if (response.success) {
        const loadedPosts = response.data;
        setPosts(loadedPosts);

        const userLikesResponse = await likeApi.getUserLikes(CURRENT_USER_ID);
        
        if (userLikesResponse.success) {
          const likesMap: {[postId: string]: Like} = {};
          userLikesResponse.data.forEach(like => {
            likesMap[like.postId] = like;
          });
          
          setUserLikes(likesMap);
          console.log('Likes do usuário carregados:', likesMap);
        }
      } else {
        setError('Falha ao carregar os posts');
      }
    } catch (err) {
      setError('Ocorreu um erro ao carregar os posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostLiked = async (postId: string, liked: boolean) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likesCount: liked 
              ? post.likesCount + 1 
              : Math.max(0, post.likesCount - 1)
          };
        }
        return post;
      })
    );

    if (liked) {
      const newLike: Like = {
        id: `temp_like_${postId}`,
        postId: postId,
        userId: CURRENT_USER_ID,
        createdAt: new Date().toISOString()
      };
      
      setUserLikes(prev => ({
        ...prev,
        [postId]: newLike
      }));
    } else {
      setUserLikes(prev => {
        const newMap = {...prev};
        delete newMap[postId];
        return newMap;
      });
    }
  };

  const isPostLikedByUser = (postId: string): boolean => {
    return !!userLikes[postId];
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Timeline</h1>
      
      <PostForm onPostCreated={handlePostCreated} />
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Carregando posts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {error}
          <button 
            onClick={loadPosts}
            className="ml-2 underline text-red-700"
          >
            Tentar novamente
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Nenhum post encontrado. Seja o primeiro a publicar algo!
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              isLiked={isPostLikedByUser(post.id)}
              onLikeToggle={(liked) => handlePostLiked(post.id, liked)} 
            />
          ))}
        </div>
      )}
    </main>
  );
}
