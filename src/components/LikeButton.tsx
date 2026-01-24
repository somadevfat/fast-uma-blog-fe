import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../lib/api';

export default function LikeButton({ slug }: { slug: string }) {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/likes/${slug}`)
      .then(res => res.json())
      .then(data => setLikes(data.count))
      .catch(console.error);
  }, [slug]);

  const handleLike = async () => {
    setLiked(true);
    setLikes(prev => prev + 1); // Optimistic update
    
    try {
      await fetch(`${API_BASE_URL}/api/likes/${slug}`, { method: 'POST' });
    } catch (e) {
      console.error(e);
      setLikes(prev => prev - 1); // Revert
      setLiked(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`px-4 py-2 rounded-full font-bold transition-all ${
        liked 
          ? 'bg-pink-100 text-pink-600 cursor-default' 
          : 'bg-gray-100 hover:bg-pink-50 text-gray-700 hover:text-pink-500'
      }`}
    >
      {liked ? '❤️ Liked!' : '🤍 Like'} <span className="ml-1">{likes}</span>
    </button>
  );
}
