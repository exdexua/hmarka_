import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border-color py-8 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-text-muted text-sm font-mono">
          <span className="material-symbols-outlined text-lg" data-icon="terminal">terminal</span>
          <span>© 2023 HMARKA.CLOUD. Усі права захищені.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link className="text-text-muted hover:text-primary text-sm font-mono transition-colors" href="#">РSS</Link>
          <Link className="text-text-muted hover:text-primary text-sm font-mono transition-colors" href="#">GitHub</Link>
          <Link className="text-text-muted hover:text-primary text-sm font-mono transition-colors" href="#">Контакти</Link>
        </div>
      </div>
    </footer>
  );
}
