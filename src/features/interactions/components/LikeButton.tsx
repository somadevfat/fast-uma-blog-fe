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
      className={`group relative flex items-center gap-2 px-8 py-3 rounded-2xl font-black transition-all duration-300 ${
        liked 
          ? 'bg-accent text-white shadow-lg shadow-accent/20 cursor-default' 
          : 'glass hover:bg-white/10 text-foreground hover:scale-105 active:scale-95'
      }`}
    >
      <span className={`text-xl transition-transform duration-500 ${liked ? 'scale-125' : 'group-hover:scale-110'}`}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span>{liked ? 'いいねしました！' : 'いいね！'}</span>
      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${liked ? 'bg-white/20' : 'bg-accent/20 text-accent'}`}>
        {likes}
      </span>
    </button>
  );
}
