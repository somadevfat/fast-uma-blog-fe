import React, { useEffect, useState } from 'react';
import { interactionsApi } from '../api/interactions.api';

export default function ViewCounter({ slug, simple }: { slug: string, simple?: boolean }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const incrementAndFetchViews = async () => {
      try {
        await interactionsApi.incrementViews(slug);
        const data = await interactionsApi.getViews(slug);
        setViews(data.count);
      } catch (error) {
        console.error('Failed to update or fetch view count:', error);
        // Fallback
        interactionsApi.getViews(slug)
          .then(data => setViews(data.count))
          .catch(console.error);
      }
    };

    incrementAndFetchViews();
  }, [slug]);

  if (views === null) return null;

  if (simple) {
    return (
      <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
        {views} Views
      </span>
    );
  }

  return (
    <span className="text-muted text-xs font-black tracking-widest flex items-center gap-2 uppercase">
      <div className="w-1 h-1 rounded-full bg-accent"></div>
      {views} Views
    </span>
  );
}