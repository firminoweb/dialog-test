// lib/types.ts

export interface User {
    id: string;
    username: string;
    name: string;
    bio?: string;
    avatar?: string;
    createdAt: string;
  }
  
  export interface Post {
    id: string;
    userId: string;
    content: string;
    imageUrl?: string;
    likesCount: number;
    createdAt: string;
    user?: User;
  }
  
  export interface Like {
    id: string;
    postId: string;
    userId: string;
    createdAt: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }
