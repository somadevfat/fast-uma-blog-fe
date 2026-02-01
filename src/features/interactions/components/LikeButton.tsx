import React, { useState, useEffect } from 'react';
import { interactionsApi } from '../api/interactions.api';

/**
 * Wikiスタイルのいいねボタンコンポーネント
 */
export default function LikeButton({ slug }: { slug: string }) {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    interactionsApi.getLikes(slug)
      .then(data => setLikes(data.count))
      .catch(console.error);
  }, [slug]);

  /**
   * いいねボタンクリック時の処理
   */
  const handleLike = async () => {
    setLiked(true);
    setLikes(prev => prev + 1);

    try {
      await interactionsApi.incrementLikes(slug);
    } catch (e) {
      console.error(e);
      setLikes(prev => prev - 1);
      setLiked(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`px-4 py-1.5 border leading-none transition-colors flex items-center gap-2 text-sm font-bold ${liked
        ? 'bg-red-50 text-red-600 border-red-200 cursor-default'
        : 'bg-white border-wiki-border text-gray-700 hover:bg-gray-50'
        }`}
    >
      <span className="text-base leading-none">{liked ? '❤️' : '🤍'}</span>
      <span>{liked ? 'いいね済' : 'いいね！'}</span>
      <span className="ml-1 px-1.5 py-0.5 bg-gray-100 border border-gray-200 text-xs text-gray-400 leading-none">
        {likes}
      </span>
    </button>
  );
}
