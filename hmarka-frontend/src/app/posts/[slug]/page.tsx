import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import EditablePost from '@/components/EditablePost';

interface Post {
  id: number;
  title: string;
  slug: string;
  content_markdown: string;
  category?: string;
  status?: string;
  created_at: string;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://backend:8000';
    const res = await fetch(`${backendUrl}/posts/${slug}`, { cache: 'no-store' });
    if (res.status === 404) return null;
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

  // Extract headings (H2 and H3) for TOC - Server side for SEO and initial load
  const headings: Array<{ level: number, text: string, slugId: string }> = [];
  const regex = /^(##|###)\s+(.*)$/gm;
  let match;
  while ((match = regex.exec(post.content_markdown || '')) !== null) {
    const level = match[1].length;
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
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">cloud</span>
            <span className="font-display font-bold text-lg tracking-tight">HMARKA<span className="text-primary cursor-blink font-mono">_</span></span>
          </Link>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row relative">
        <EditablePost post={post} />

        {/* Right Sidebar (Table of Contents) */}
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
      <Footer />
    </div>
  );
}
