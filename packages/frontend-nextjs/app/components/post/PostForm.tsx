'use client';

import { useState } from 'react';
import { postApi } from '@/lib/api';
import { Post } from '@/lib/types';

interface PostFormProps {
  onPostCreated?: (post: Post) => void;
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('O conteúdo do post não pode estar vazio');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await postApi.createPost({
        content,
        userId: 'user123',
        createdAt: new Date().toISOString(),
        likesCount: 0
      });
      
      if (response.success && response.data) {
        setContent('');
        if (onPostCreated) onPostCreated(response.data);
      } else {
        setError(response.message || 'Erro ao criar post');
      }
    } catch (err) {
      setError('Erro ao criar post. Tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="post-content" className="sr-only">
            O que você está pensando?
          </label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none resize-none"
            placeholder="O que você está pensando?"
            rows={3}
          />
        </div>
        
        {error && (
          <div className="mb-3 text-red-500 text-sm">{error}</div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}
