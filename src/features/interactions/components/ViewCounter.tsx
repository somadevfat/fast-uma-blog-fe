import React, { useEffect, useState } from 'react';
import { interactionsApi } from '../api/interactions.api';

export default function ViewCounter({ slug }: { slug: string }) {
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

  if (views === null) return <span className="text-gray-400 text-sm">Loading...</span>;

  return (
    <span className="text-gray-600 text-sm flex items-center gap-1">
      👁️ {views}
    </span>
  );
}