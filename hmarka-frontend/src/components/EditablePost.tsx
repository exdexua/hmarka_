'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Markdown } from 'tiptap-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import EditorToolbar from '@/components/EditorToolbar';
import { ResizableImage, CustomCodeBlock } from '@/components/editor/TiptapExtensions';
import { CATEGORIES } from '@/utils/slugify';
import CodeBlock from '@/components/CodeBlock';

interface Post {
  id: number;
  title: string;
  slug: string;
  content_markdown: string;
  category?: string;
  created_at: string;
}

export default function EditablePost({ post: initialPost }: { post: Post }) {
  const [isEditing, setIsEditing] = useState(false);
  const [post, setPost] = useState(initialPost);
  const [title, setTitle] = useState(initialPost.title);
  const [category, setCategory] = useState(initialPost.category || 'General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CustomCodeBlock,
      ResizableImage,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      })
    ],
    content: post.content_markdown,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none text-lg outline-none min-h-[300px]',
      },
    },
  });

  const handleSave = async () => {
    if (!editor) return;
    setLoading(true);
    setError(null);

    // @ts-ignore: Tiptap doesn't type the markdown storage correctly internally
    const updatedContent = (editor.storage.markdown as any).getMarkdown();

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug: post.slug, // Keep old slug
          category,
          content_markdown: updatedContent,
          status: 'published',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to update post');
      }

      const updatedPost = await res.json();
      setPost(updatedPost);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/upload/`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border-color">
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase tracking-widest">Заголовок</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background-dark border border-border-color rounded-sm px-4 py-2 text-text-main focus:border-primary outline-none font-display text-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase tracking-widest">Категорія</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background-dark border border-border-color rounded-sm px-4 py-2 text-text-main focus:border-primary outline-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-background-dark border border-border-color rounded-sm overflow-hidden">
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          <EditorToolbar 
            editor={editor} 
            isFullscreen={false} 
            onToggleFullscreen={() => {}} 
            onImageUploadClick={() => fileInputRef.current?.click()} 
          />
          <div className="p-4 md:p-8">
             {editor && (
                <BubbleMenu editor={editor} shouldShow={({ editor }) => editor.isActive('image')}>
                  <div className="flex items-center gap-1 p-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()} className="px-3 py-1 text-xs hover:bg-gray-700 text-gray-200 rounded">25%</button>
                    <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()} className="px-3 py-1 text-xs hover:bg-gray-700 text-gray-200 rounded">50%</button>
                    <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()} className="px-3 py-1 text-xs hover:bg-gray-700 text-gray-200 rounded">100%</button>
                  </div>
                </BubbleMenu>
              )}
            <EditorContent editor={editor} />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex items-center gap-4 pt-4">
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="px-6 py-2 bg-primary text-background-dark font-mono font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-[#b3e600] transition-colors"
          >
            {loading ? 'Збереження...' : '💾 Зберегти'}
          </button>
          <button 
            onClick={() => setIsEditing(false)} 
            className="px-6 py-2 border border-border-color text-text-muted font-mono text-sm uppercase tracking-wider rounded-sm hover:text-text-main transition-colors"
          >
            ❌ Скасувати
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <article className="flex-1 w-full max-w-[680px] mx-auto px-4 py-8 md:py-16 lg:px-0">
      <div className="mb-12">
        <div className="flex justify-between items-start mb-6">
          <nav className="flex flex-wrap gap-2 text-sm font-mono text-text-muted uppercase tracking-wide">
            <a href="/" className="hover:text-primary transition-colors">Головна</a>
            <span>/</span>
            <span className="text-text-main">{category}</span>
          </nav>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1 border border-border-color rounded-sm font-mono text-xs text-text-muted hover:text-primary hover:border-primary transition-all"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Редагувати
          </button>
        </div>

        <h1 className="font-display text-4xl md:text-5xl lg:text-[48px] font-bold leading-tight mb-6 text-text-main text-balance">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-text-muted uppercase tracking-wider">
          <time>{formattedDate}</time>
          <span className="w-1 h-1 bg-border-color rounded-full"></span>
          <span>Admin</span>
          <span className="w-1 h-1 bg-border-color rounded-full"></span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            5 хв читання
          </span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none text-lg">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            pre({ children }) { return <>{children}</>; },
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              if (!match && !className?.includes('language-')) {
                return <code className={className} {...props}>{children}</code>;
              }
              return <CodeBlock code={String(children).replace(/\n$/, '')} language={match ? match[1] : 'bash'} />;
            },
            h2({ children, ...props }) {
              const id = String(children).toLowerCase().replace(/[^a-z0-9а-яєії]+/g, '-').replace(/(^-|-$)+/g, '');
              return <h2 id={id} {...props}>{children}</h2>;
            },
            h3({ children, ...props }) {
              const id = String(children).toLowerCase().replace(/[^a-z0-9а-яєії]+/g, '-').replace(/(^-|-$)+/g, '');
              return <h3 id={id} {...props}>{children}</h3>;
            },
            img({ node, ...props }: any) {
              const align = props['data-align'] || props.align || 'left';
              const width = props.width || 'auto';
              
              let justifyClass = 'justify-start';
              if (align === 'center') justifyClass = 'justify-center';
              if (align === 'right') justifyClass = 'justify-end';
              
              return (
                <div className={`w-full flex ${justifyClass} py-4`} data-image-wrapper>
                  <img 
                    {...props} 
                    className="h-auto rounded-md block" 
                    style={{ 
                      width: width,
                      minWidth: width !== 'auto' ? width : undefined,
                      maxWidth: width !== 'auto' ? width : '100%'
                    }}
                  />
                </div>
              );
            }
          }}
        >
          {post.content_markdown}
        </ReactMarkdown>
      </div>

      <div className="mt-16 pt-8 border-t border-border-color flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-surface border border-border-color rounded-sm font-mono text-xs text-text-muted uppercase">{category}</span>
        <span className="px-3 py-1 bg-surface border border-border-color rounded-sm font-mono text-xs text-text-muted uppercase">ARTICLE</span>
      </div>
    </article>
  );
}
