import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../lib/api';

export default function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Increment view count
    fetch(`${API_BASE_URL}/api/views/${slug}`, { method: 'POST' })
      .catch(console.error);

    // Fetch current view count
    fetch(`${API_BASE_URL}/api/views/${slug}`)
      .then(res => res.json())
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
