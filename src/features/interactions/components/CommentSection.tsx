import React, { useState, useEffect } from 'react';
import { interactionsApi, type Comment } from '../api/interactions.api';

/**
 * Wikiスタイルのコメントセクションコンポーネント
 */
export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    interactionsApi.getComments(slug)
      .then(data => setComments(data))
      .catch(console.error);
  }, [slug]);

  /**
   * コメント送信処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const newCommentData = await interactionsApi.postComment(slug, newComment);
      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="sidebar-box !mb-0 !bg-gray-50 border-wiki-border">
        <div className="sidebar-title">コメントを投稿する</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 bg-white border border-wiki-border text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            rows={3}
            placeholder="コメントを入力してください..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="px-4 py-2 bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? '送信中...' : 'コメントを投稿'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border border-wiki-border bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Anonymous User
              </span>
              <span className="text-[10px] text-gray-400">
                {new Date(comment.created_at).toLocaleString('ja-JP')}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm italic py-4 text-center border border-dashed border-wiki-border">
            まだコメントはありません。
          </p>
        )}
      </div>
    </div>
  );
}