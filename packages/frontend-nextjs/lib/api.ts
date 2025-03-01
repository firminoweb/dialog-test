// lib/api.ts

import { User, Post, Like, ApiResponse } from './types';

const API_URL = 'http://localhost:3001';

// Função auxiliar para fazer requisições
async function fetchAPI<T>(
  endpoint: string, 
  method: string = 'GET', 
  body?: any
): Promise<ApiResponse<T>> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      data: data,
      success: response.ok,
      message: response.ok ? 'Success' : 'Failed',
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      data: {} as T,
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// API de Usuários
export const userApi = {
  getCurrentUser: () => fetchAPI<User>('/users/me'),
  getUserById: (id: string) => fetchAPI<User>(`/users/${id}`),
  updateUser: (id: string, userData: Partial<User>) => fetchAPI<User>(`/users/${id}`, 'PUT', userData),
};

// API de Posts
export const postApi = {
  getPosts: () => fetchAPI<Post[]>('/posts'),
  getPostById: (id: string) => fetchAPI<Post>(`/posts/${id}`),
  getUserPosts: (userId: string) => fetchAPI<Post[]>(`/posts/user/${userId}`),
  createPost: (postData: Partial<Post>) => fetchAPI<Post>('/posts', 'POST', postData),
  updatePost: (id: string, postData: Partial<Post>) => fetchAPI<Post>(`/posts/${id}`, 'PUT', postData),
  deletePost: (id: string) => fetchAPI<{ success: boolean }>(`/posts/${id}`, 'DELETE'),
};

// API de Curtidas
export const likeApi = {
  likePost: (postId: string) => fetchAPI<Like>('/likes', 'POST', { postId }),
  unlikePost: (likeId: string) => fetchAPI<{ success: boolean }>(`/likes/${likeId}`, 'DELETE'),
  getPostLikes: (postId: string) => fetchAPI<Like[]>(`/likes/post/${postId}`),
};
