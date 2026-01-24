import React, { useState, useEffect } from 'react';
import { interactionsApi } from '../api/interactions.api';

export default function LikeButton({ slug }: { slug: string }) {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    interactionsApi.getLikes(slug)
      .then(data => setLikes(data.count))
      .catch(console.error);
  }, [slug]);

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
