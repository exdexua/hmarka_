'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlock from '@tiptap/extension-code-block';
import { Markdown } from 'tiptap-markdown';
import EditorToolbar from '@/components/EditorToolbar';
import { ResizableImage, CustomCodeBlock } from '@/components/editor/TiptapExtensions';
import { CATEGORIES, slugify } from '@/utils/slugify'; // Assuming I move these too or keep them for now. Let's just import extensions first.

// Removed local extensions, now using shared ones.

export default function EditorPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState<string>('General');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // deactivate standard code block to use our custom one
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
        html: true, // Allow HTML tags for image resizing serialization
        transformPastedText: true,
        transformCopiedText: true,
      })
    ],
    content: contentMarkdown,
    onUpdate: ({ editor }) => {
      // @ts-ignore
      setContentMarkdown((editor.storage.markdown as any).getMarkdown());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none text-lg min-h-[300px] outline-none p-4 lg:px-0',
      },
    },
  });

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

      if (!res.ok) {
        throw new Error('Не вдалося завантажити картинку');
      }

      const data = await res.json();
      const url = data.url || data.file_url || data.detail;

      editor.chain().focus().setImage({ src: url }).run();
    } catch (err: any) {
      alert(err.message || 'Помилка завантаження зображення');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Lock body scroll when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // @ts-ignore
    const finalContent = editor ? (editor.storage.markdown as any).getMarkdown() : contentMarkdown;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          category,
          content_markdown: finalContent,
          status: 'published',
          author_id: 1, // Hardcoded
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Не вдалося створити публікацію');
      }

      router.push(`/posts/${slug}`);
    } catch (err: any) {
      setError(err.message || 'Щось пішло не так при з\'єднанні з сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setSlug(e.target.value);
  };

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[100] bg-gray-950 flex flex-col p-0' : 'min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4 sm:p-8 font-sans'}`}>
      
      {!isFullscreen && (
        <>
          {/* Decorative background glows */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-10"></div>
          <div className="fixed -top-32 -right-32 w-64 h-64 bg-purple-600 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
          <div className="fixed -bottom-32 -left-32 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        </>
      )}

      <div className={`${isFullscreen ? 'w-full h-full flex flex-col' : 'w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-6 sm:p-10'} relative overflow-y-auto`}>
        
        {!isFullscreen && (
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 w-fit">
            Створити нову публікацію
          </h1>
        )}

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center shadow-inner relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`relative z-10 flex flex-col ${isFullscreen ? 'h-full max-w-5xl mx-auto w-full pt-8' : 'space-y-8'}`}>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isFullscreen ? 'mb-6 shrink-0' : ''}`}>
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-300">
                Заголовок
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Введіть заголовок..."
                className="w-full px-5 py-3.5 rounded-xl bg-gray-950/80 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 placeholder-gray-600 shadow-inner"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-semibold text-gray-300">
                Slug (URL)
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="my-awesome-post"
                className="w-full px-5 py-3.5 rounded-xl bg-gray-950/80 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 placeholder-gray-600 font-mono text-sm shadow-inner"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-300">
                Категорія
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-gray-950/80 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 shadow-inner appearance-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-gray-900 text-gray-100">{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={`space-y-2 flex flex-col ${isFullscreen ? 'grow min-h-0' : ''}`}>
            <div className="flex items-center justify-between text-sm font-semibold text-gray-300">
              <label>Контент <span className="text-gray-500 text-xs font-normal">WYSIWYG Editor</span></label>
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
            />

            <div className={`flex flex-col bg-gray-950/80 border border-gray-700 rounded-xl overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500 transition-all duration-300 ${isFullscreen ? 'grow' : ''}`}>
              
              {editor && (
                <BubbleMenu editor={editor} shouldShow={({ editor }) => editor.isActive('image')}>
                  <div className="flex items-center gap-1 p-2 bg-gray-800 rounded-lg shadow-xl shadow-black/50 border border-gray-700">
                    <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()} className="px-3 py-1 text-xs hover:bg-gray-700 text-gray-200 rounded">25%</button>
                    <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()} className="px-3 py-1 text-xs hover:bg-gray-700 text-gray-200 rounded">50%</button>
                    <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()} className="px-3 py-1 text-xs hover:bg-gray-700 text-gray-200 rounded">100%</button>
                  </div>
                </BubbleMenu>
              )}

              <EditorToolbar 
                editor={editor} 
                isFullscreen={isFullscreen} 
                onToggleFullscreen={toggleFullscreen} 
                onImageUploadClick={triggerFileInput} 
              />
              
              <div className={`w-full overflow-y-auto ${isFullscreen ? 'grow p-4' : 'h-[400px]'}`}>
                <EditorContent editor={editor} className="h-full" />
              </div>
            </div>
          </div>

          <div className={`flex justify-end pt-4 ${isFullscreen ? 'shrink-0 pb-8' : 'border-t border-gray-800/60 mt-8'}`}>
            <button
              type="submit"
              disabled={loading}
              className={`
                px-8 py-3.5 rounded-xl font-bold text-white shadow-xl transition-all duration-300 flex items-center justify-center min-w-[200px]
                ${loading 
                  ? 'bg-gray-800 cursor-not-allowed text-gray-400 border border-gray-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-purple-500/25 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] border border-transparent'}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Опублікування...
                </>
              ) : (
                'Опублікувати'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
