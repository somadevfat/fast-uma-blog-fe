import { API_BASE_URL } from '../../../lib/api';

export interface Comment {
  id: number;
  slug: string;
  content: string;
  created_at: number;
}

export type NewCommentPayload = Pick<Comment, 'content'>;

export const interactionsApi = {
  // Views
  getViews: async (slug: string): Promise<{ count: number }> => {
    const res = await fetch(`${API_BASE_URL}/api/views/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch views');
    return res.json();
  },
  incrementViews: async (slug: string): Promise<Response> => {
    const res = await fetch(`${API_BASE_URL}/api/views/${slug}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to increment views');
    return res;
  },

  // Likes
  getLikes: async (slug: string): Promise<{ count: number }> => {
    const res = await fetch(`${API_BASE_URL}/api/likes/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch likes');
    return res.json();
  },
  incrementLikes: async (slug: string): Promise<Response> => {
    const res = await fetch(`${API_BASE_URL}/api/likes/${slug}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to increment likes');
    return res;
  },

  // Comments
  getComments: async (slug: string): Promise<Comment[]> => {
    const res = await fetch(`${API_BASE_URL}/api/comments/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },
  postComment: async (slug: string, content: string): Promise<Comment> => {
    const res = await fetch(`${API_BASE_URL}/api/comments/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to post comment');
    return res.json();
  },
};