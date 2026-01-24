import React, { useState, useEffect } from 'react';
import { interactionsApi, type Comment } from '../api/interactions.api';

export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    interactionsApi.getComments(slug)
      .then(data => setComments(data))
      .catch(console.error);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const newCommentData = await interactionsApi.postComment(slug, newComment);
      // 再フェッチせずにステートを更新 (効率化)
      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          rows={3}
          placeholder="Leave a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-800">{comment.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 italic">No comments yet.</p>
        )}
      </div>
    </div>
  );
}