import React, { useEffect, useState } from 'react';
import { interactionsApi } from '../api/interactions.api';

export default function ViewCounter({ slug, hideIcon = false, simple = false }: { slug: string, hideIcon?: boolean, simple?: boolean }) {
  const [views, setViews] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        if (!simple) {
          await interactionsApi.incrementViews(slug);
        }
        const data = await interactionsApi.getViews(slug);
        setViews(data.count ?? 0);
      } catch (err) {
        console.error('ViewCounter fetch error:', err);
        setError(true);
        setViews(0); // エラーでも 0 を表示
      }
    };

    fetchViews();
  }, [slug, simple]);

  // 通信前の状態
  if (views === null && !error) {
    return (
      <span className="text-[10px] font-black uppercase tracking-widest text-muted/30 animate-pulse">
        ...
      </span>
    );
  }

  if (simple) {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted">
        {!hideIcon && <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500/40' : 'bg-accent/40'}`}></span>}
        {views} Views
      </span>
    );
  }

  return (
    <span className="glass px-4 py-1.5 rounded-full text-muted text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-white/5">
      <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
      {views} Views
    </span>
  );
}
