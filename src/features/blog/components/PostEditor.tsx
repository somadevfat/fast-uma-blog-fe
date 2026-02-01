import React, { useState, useMemo } from 'react';
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

/**
 * Wiki記事編集コンポーネント
 */
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
        return marked.parse(data.content || '');
    }, [data.content]);

    /**
     * 記事の保存処理
     */
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '保存中...', type: '' });

        try {
            const res = await fetch(`${apiBaseUrl}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (result.success) {
                setMessage({ text: '保存が完了しました。', type: 'success' });
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } else {
                setMessage({ text: `エラー: ${result.error}`, type: 'error' });
            }
        } catch (err: any) {
            setMessage({ text: `通信エラー: ${err.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Status Bar */}
            <div className="flex items-center justify-between p-4 bg-white border border-wiki-border shadow-sm sticky top-16 z-40">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : message.type === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                    <span className="text-xs font-bold text-gray-500">
                        {message.text || (loading ? '処理中...' : '編集中...')}
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-xs font-bold text-gray-400 group-hover:text-gray-700">公開状態:</span>
                        <input
                            type="checkbox"
                            checked={data.published}
                            onChange={(e) => setData({ ...data, published: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <span className="text-xs font-bold">{data.published ? '公開' : '下書き'}</span>
                    </label>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-primary text-white text-xs font-bold px-6 py-2 shadow-sm hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? '保存中...' : 'Wikiを更新する'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Editor View */}
                <div className="bg-white border border-wiki-border shadow-sm p-6 space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">ページタイトル</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            placeholder="記事のタイトルを入力..."
                            className="w-full bg-gray-50 border border-wiki-border px-3 py-2 text-lg font-bold focus:outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">URLスラッグ</label>
                        <div className="flex items-center">
                            <span className="bg-gray-100 border border-wiki-border border-r-0 px-3 py-2 text-xs text-gray-500">/blog/</span>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData({ ...data, slug: e.target.value })}
                                className="w-full bg-gray-50 border border-wiki-border px-3 py-2 text-xs font-mono focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">本文 (Markdown)</label>
                        <textarea
                            rows={20}
                            value={data.content}
                            onChange={(e) => setData({ ...data, content: e.target.value })}
                            className="w-full bg-gray-50 border border-wiki-border px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none resize-none"
                            placeholder="# ここに内容を記述してください"
                            required
                        />
                    </div>
                </div>

                {/* Preview View */}
                <div className="bg-white border border-wiki-border shadow-sm p-8 h-fit xl:sticky xl:top-48 overflow-y-auto max-h-[800px]">
                    <div className="border-b border-wiki-border pb-2 mb-6">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Wiki Preview</span>
                    </div>

                    <div className="prose max-w-none">
                        <h1 className="!border-0 !mb-4">{data.title || '（無題）'}</h1>
                        <div
                            className="wiki-preview-content"
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
