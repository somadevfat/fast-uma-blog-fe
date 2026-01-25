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
      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-white/5">
      <h3 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-4">
        コメント
        <span className="text-sm font-bold bg-white/5 px-3 py-1 rounded-full text-muted">{comments.length}</span>
      </h3>
      
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="glass p-1 rounded-3xl focus-within:border-accent/30 transition-all duration-300">
          <textarea
            className="w-full p-6 bg-transparent text-foreground placeholder:text-muted outline-none resize-none min-h-[120px] font-medium"
            placeholder="コメントを残す..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
          />
          <div className="flex justify-end p-2">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="px-6 py-3 bg-white text-black rounded-2xl font-black hover:bg-accent hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all duration-300"
            >
              {loading ? '投稿中...' : 'コメントを投稿'}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent to-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-foreground leading-relaxed text-lg mb-4 font-medium">{comment.content}</p>
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent/20 to-accent-secondary/20 flex items-center justify-center text-[10px] font-black text-accent">U</div>
               <time className="text-[10px] font-black text-muted uppercase tracking-widest">
                {new Date(comment.created_at).toLocaleString('ja-JP')}
              </time>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="glass p-12 rounded-3xl border-dashed border-white/10 text-center">
             <p className="text-muted font-bold italic">まだコメントはありません。最初の感想を書き込んでみませんか？</p>
          </div>
        )}
      </div>
    </div>
  );
}