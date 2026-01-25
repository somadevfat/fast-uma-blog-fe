import React, { useState, useMemo, useEffect } from 'react';
import { marked } from 'marked';

interface PostData {
    slug: string;
    title: string;
    content: string;
    published: boolean;
}

interface Props {
    initialData?: PostData;
    apiBaseUrl: string;
}

export const PostEditor: React.FC<Props> = ({ initialData, apiBaseUrl }) => {
    const [data, setData] = useState<PostData>(initialData || {
        slug: '',
        title: '',
        content: '',
        published: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | '' }>({ text: '', type: '' });

    const previewHtml = useMemo(() => {
        // Generate styled markdown preview
        return marked.parse(data.content || '');
    }, [data.content]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: 'Saving to database...', type: '' });

        try {
            const res = await fetch(`${apiBaseUrl}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (result.success) {
                setMessage({ text: 'Saved successfully!', type: 'success' });
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } else {
                setMessage({ text: `Error: ${result.error}`, type: 'error' });
            }
        } catch (err: any) {
            setMessage({ text: `Network Error: ${err.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Action Bar */}
            <div className="flex items-center justify-between glass p-4 rounded-2xl sticky top-24 z-40">
                <div className="flex items-center gap-4 px-2">
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500 animate-pulse' : message.type === 'error' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                        {message.text || (loading ? 'Processing...' : 'Ready to save')}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">Published</span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={data.published}
                                onChange={(e) => setData({ ...data, published: e.target.checked })}
                                className="sr-only p-4"
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${data.published ? 'bg-pink-500' : 'bg-gray-800'}`}></div>
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${data.published ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </label>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-white text-black text-xs font-black uppercase tracking-[0.1em] px-8 py-2.5 rounded-xl hover:bg-pink-500 hover:text-white transition-all disabled:opacity-50"
                    >
                        {loading ? 'Wait...' : 'Update Production'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                {/* Editor Pane */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[2rem] space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Article Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                placeholder="The Future of ElysiaJS..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-gray-700"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Uniform Resource Locator (Slug)</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-xs font-black text-gray-600">/blog/</span>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData({ ...data, slug: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 pl-16 text-xs font-bold focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Markdown Core Content</label>
                            <textarea
                                rows={25}
                                value={data.content}
                                onChange={(e) => setData({ ...data, content: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm font-medium leading-relaxed font-mono focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-gray-700 resize-none scrollbar-thin scrollbar-thumb-white/10"
                                placeholder="# Start writing your masterpiece..."
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Live Preview Pane */}
                <div className="sticky top-44 overflow-hidden">
                    <div className="glass rounded-[2rem] p-10 h-[750px] overflow-y-auto scrollbar-hide">
                        <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Realtime Virtual DOM Preview</h3>
                        </div>

                        <div className="prose prose-invert prose-pink max-w-none">
                            <h1 className="text-4xl font-black font-['Outfit'] tracking-tighter mb-8">{data.title || 'Draft Title'}</h1>
                            <div
                                className="prose-p:leading-[1.8] prose-p:text-gray-400 prose-headings:font-black prose-headings:tracking-tighter prose-code:text-pink-400 prose-code:bg-pink-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
                                dangerouslySetInnerHTML={{ __html: previewHtml }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
