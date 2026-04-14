import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Footer from '@/components/Footer';
import CodeBlock from '@/components/CodeBlock';

interface Post {
  id: number;
  title: string;
  slug: string;
  content_markdown: string;
  status?: string;
  created_at: string;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/posts/${slug}`, { cache: 'no-store' });
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      console.error('Failed to fetch post');
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const dateObj = new Date(post.created_at);
  const formattedDate = isNaN(dateObj.getTime()) ? 'Невідома дата' : dateObj.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Extract headings (H2 and H3) for dynamic TOC
  const headings: Array<{ level: number, text: string, slugId: string }> = [];
  const regex = /^(##|###)\s+(.*)$/gm;
  let match;
  while ((match = regex.exec(post.content_markdown || '')) !== null) {
    const level = match[1].length; // 2 for h2, 3 for h3
    const text = match[2];
    const slugId = text.toLowerCase().replace(/[^a-z0-9а-яєії]+/g, '-').replace(/(^-|-$)+/g, '');
    headings.push({ level, text, slugId });
  }

  return (
    <div className="font-body antialiased min-h-screen flex flex-col">
      {/* Header (Minimalist Back) */}
      <header className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-sm border-b border-border-color h-16 flex items-center px-4 md:px-8">
        <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors group">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="font-mono text-sm uppercase tracking-wider hidden sm:inline-block">До списку статей</span>
          </Link>
          {/* Logo area */}
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">cloud</span>
            <span className="font-display font-bold text-lg tracking-tight">HMARKA<span className="text-primary">_</span></span>
          </Link>
          <div className="w-8"></div> {/* Spacer to balance header */}
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row relative">
        {/* Main Content Area */}
        <article className="flex-1 w-full max-w-[680px] mx-auto px-4 py-8 md:py-16 lg:px-0">
          
          {/* Breadcrumbs & Meta */}
          <div className="mb-12">
            <nav className="flex flex-wrap gap-2 text-sm font-mono text-text-muted mb-6 uppercase tracking-wide">
              <Link href="/" className="hover:text-primary transition-colors">Головна</Link>
              <span>/</span>
              <span className="text-text-main truncate max-w-[200px] sm:max-w-none">Стаття</span>
            </nav>
            <h1 className="font-display text-4xl md:text-5xl lg:text-[48px] font-bold leading-tight mb-6 text-text-main">
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

          {/* Article Body */}
          <div className="prose prose-invert max-w-none text-lg">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                pre({ children }) {
                  return <>{children}</>;
                },
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  
                  // If it's inline code or doesn't have a specific language, render normally
                  if (!match && !className?.includes('language-')) {
                    return <code className={className} {...props}>{children}</code>;
                  }

                  return (
                    <CodeBlock 
                      code={String(children).replace(/\n$/, '')} 
                      language={match ? match[1] : 'bash'} 
                    />
                  );
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
                  const align = props['data-align'] || 'left';
                  let alignClass = 'inline-block';
                  if (align === 'center') alignClass = 'mx-auto block';
                  if (align === 'right') alignClass = 'ml-auto block';
                  return <img className={`max-w-full h-auto rounded-md ${alignClass}`} {...props} />;
                }
              }}
            >
              {post.content_markdown}
            </ReactMarkdown>
          </div>

          {/* Article Footer Tags */}
          <div className="mt-16 pt-8 border-t border-border-color flex flex-wrap gap-2">
            <a href="#" className="px-3 py-1 bg-surface border border-border-color rounded-sm font-mono text-xs text-text-muted hover:text-primary hover:border-primary transition-colors">DOCKER</a>
            <a href="#" className="px-3 py-1 bg-surface border border-border-color rounded-sm font-mono text-xs text-text-muted hover:text-primary hover:border-primary transition-colors">DEVOPS</a>
          </div>
        </article>

        {/* Right Sidebar (Table of Contents) - Hidden on mobile/tablet */}
        <aside className="hidden lg:block w-[250px] shrink-0 pt-16 pb-8 pl-8">
          <div className="sticky top-24">
            <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4 border-l-2 border-transparent pl-3">Навігація</h4>
            <nav className="flex flex-col space-y-3 font-mono text-[13px]">
              {headings.length > 0 ? (
                headings.map((h, i) => (
                  <a 
                    key={i}
                    href={`#${h.slugId}`}
                    className={`${h.level === 3 ? 'pl-6' : 'pl-3'} text-text-muted hover:text-text-main border-l-2 border-border-color transition-colors`}
                  >
                    {h.text}
                  </a>
                ))
              ) : (
                <span className="text-text-muted pl-3">Зміст відсутній</span>
              )}
            </nav>
            <div className="mt-12 p-4 bg-surface border border-border-color rounded-sm">
              <h5 className="font-display text-sm font-bold text-text-main mb-2">Підтримай проект</h5>
              <p className="text-xs text-text-muted mb-4 font-body leading-relaxed">Отримуй нові скрипти та статті першим у нашому Telegram каналі.</p>
              <a href="#" className="block w-full py-2 bg-[#CCFF00] hover:bg-[#b3e600] text-[#121212] text-center font-mono text-xs font-bold uppercase tracking-wide rounded-sm transition-colors">
                Підписатися
              </a>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
