import React, { useEffect, useState } from 'react';
import { interactionsApi } from '../api/interactions.api';

export default function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Increment view count
    interactionsApi.incrementViews(slug).catch(console.error);

    // Fetch current view count
    interactionsApi.getViews(slug)
      .then(data => setViews(data.count))
      .catch(console.error);
  }, [slug]);

  if (views === null) return <span className="text-gray-400 text-sm">Loading...</span>;

  return (
    <span className="text-gray-600 text-sm flex items-center gap-1">
      👁️ {views}
    </span>
  );
}
