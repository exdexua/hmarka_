import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content_markdown: string;
  status?: string;
  created_at: string;
}

export default function PostCard({ post }: { post: Post }) {
  const dateObj = new Date(post.created_at);
  const formattedDate = isNaN(dateObj.getTime()) ? 'Невідома дата' : dateObj.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Link href={`/posts/${post.slug || post.id}`} className="block group">
      <article className="article-card border-l border-border-color pl-6 py-6 border-b">
        <div className="flex items-center gap-3 mb-3">
          <time className="font-mono text-xs text-text-muted">{formattedDate}</time>
          <span className="w-1 h-1 rounded-full bg-border-color"></span>
          <span className="bg-surface border border-border-color text-white text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider rounded-sm">Article</span>
        </div>
        <h3 className="font-display text-2xl mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <div className="text-text-muted text-base leading-relaxed mb-4 line-clamp-3">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <span className="block font-bold text-white mt-2 mb-1" {...props} />,
              h2: ({node, ...props}) => <span className="block font-bold text-white mt-2 mb-1" {...props} />,
              h3: ({node, ...props}) => <span className="block font-bold text-white mt-2 mb-1" {...props} />,
              p: ({node, ...props}) => <span className="block mb-2 text-text-muted" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside text-text-muted mb-2" {...props} />,
              a: ({node, href, ...props}) => <span className="text-primary hover:text-white" {...props} />
            }}
          >
            {post.content_markdown || 'Немає опису...'}
          </ReactMarkdown>
        </div>
      </article>
    </Link>
  );
}
