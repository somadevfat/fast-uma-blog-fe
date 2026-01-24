import { API_BASE_URL } from '../../../lib/api';

export interface Comment {
  id?: number;
  slug: string;
  content: string;
  created_at: number;
}

export const interactionsApi = {
  // Views
  getViews: async (slug: string) => {
    const res = await fetch(`${API_BASE_URL}/api/views/${slug}`);
    return res.json() as Promise<{ count: number }>;
  },
  incrementViews: async (slug: string) => {
    return fetch(`${API_BASE_URL}/api/views/${slug}`, { method: 'POST' });
  },

  // Likes
  getLikes: async (slug: string) => {
    const res = await fetch(`${API_BASE_URL}/api/likes/${slug}`);
    return res.json() as Promise<{ count: number }>;
  },
  incrementLikes: async (slug: string) => {
    return fetch(`${API_BASE_URL}/api/likes/${slug}`, { method: 'POST' });
  },

  // Comments
  getComments: async (slug: string) => {
    const res = await fetch(`${API_BASE_URL}/api/comments/${slug}`);
    return res.json() as Promise<Comment[]>;
  },
  postComment: async (slug: string, content: string) => {
    return fetch(`${API_BASE_URL}/api/comments/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  },
};
