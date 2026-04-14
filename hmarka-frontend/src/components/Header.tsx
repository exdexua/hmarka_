import Link from 'next/link';

export default function Header() {
  return (
    <header className="h-16 border-b border-border-color sticky top-0 bg-background-dark/95 backdrop-blur-sm z-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center gap-2 group" href="/">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl" data-icon="cloud">cloud</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            HMARKA<span className="text-primary cursor-blink font-mono">_</span>
          </span>
        </Link>
        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link className="nav-link text-text-muted text-sm font-medium font-mono uppercase tracking-wider" href="#">Windows</Link>
          <Link className="nav-link text-text-muted text-sm font-medium font-mono uppercase tracking-wider" href="#">Linux</Link>
          <Link className="nav-link text-text-muted text-sm font-medium font-mono uppercase tracking-wider" href="#">Docker</Link>
          <Link className="nav-link text-text-muted text-sm font-medium font-mono uppercase tracking-wider" href="#">Мережі</Link>
        </nav>
        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-text-muted hover:text-white transition-colors">
          <span className="material-symbols-outlined" data-icon="menu">menu</span>
        </button>
      </div>
    </header>
  );
}
