import { User, Post, Like, ApiResponse } from './types';

const API_URL = 'http://localhost:3001';

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

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
    console.log(`Enviando para ${endpoint}:`, options.body);
  }

  try {
    console.log(`Requisição ${method} para ${API_URL}${endpoint}`);
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.warn(`Resposta não é JSON: ${text}`);
      data = { message: text };
    }
    
    console.log(`Resposta de ${endpoint}:`, data);
    
    return {
      data: data.data || data,
      success: response.ok && (data.success !== false),
      message: data.message || (response.ok ? 'Success' : 'Failed'),
    };
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    return {
      data: {} as T,
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const userApi = {
  getCurrentUser: () => fetchAPI<User>('/users/me'),
  getUserById: (id: string) => fetchAPI<User>(`/users/${id}`),
  updateUser: (id: string, userData: Partial<User>) => 
    fetchAPI<User>(`/users/${id}`, 'PUT', userData),
};

export const postApi = {
  getPosts: () => fetchAPI<Post[]>('/posts'),
  getPostById: (id: string) => fetchAPI<Post>(`/posts/${id}`),
  getUserPosts: (userId: string) => fetchAPI<Post[]>(`/posts/user/${userId}`),
  createPost: (postData: Partial<Post>) => 
    fetchAPI<Post>('/posts', 'POST', postData),
  updatePost: (id: string, postData: Partial<Post>) => 
    fetchAPI<Post>(`/posts/${id}`, 'PUT', postData),
  deletePost: (id: string) => 
    fetchAPI<{ success: boolean }>(`/posts/${id}`, 'DELETE'),
};

export const likeApi = {
  likePost: (postId: string, userId: string = 'user123') => {
    console.log('likeApi.likePost chamado com:', { postId, userId });
    return fetchAPI<Like>('/likes', 'POST', { postId, userId });
  },
  unlikePost: (likeId: string) => 
    fetchAPI<{ success: boolean }>(`/likes/${likeId}`, 'DELETE'),
  getPostLikes: (postId: string) => 
    fetchAPI<Like[]>(`/likes/post/${postId}`),
  getUserLikes: (userId: string) =>
    fetchAPI<Like[]>(`/likes/user/${userId}`),
};
