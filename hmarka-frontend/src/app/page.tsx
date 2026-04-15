import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard, { Post } from '@/components/PostCard';

async function getPosts(category?: string): Promise<Post[]> {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://backend:8000';
    const url = category 
      ? `${backendUrl}/posts/category/${category}`
      : `${backendUrl}/posts/`;
      
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch posts ${category ? 'for category ' + category : ''}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function Home(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const category = searchParams.category;
  const posts = await getPosts(category);

  const pageTitle = category 
    ? `Публікації: ${category.charAt(0).toUpperCase() + category.slice(1)}`
    : 'Останні публікації';

  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-32 px-4 lg:px-6 max-w-[1200px] mx-auto flex flex-col items-center text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl max-w-4xl leading-tight mb-12">
            Твій провідник у світ Хмар та Автоматизації
          </h1>
          {/* Search Bar */}
          <div className="w-full max-w-[480px] relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted" data-icon="search">search</span>
            </div>
            <input 
              className="w-full h-12 bg-surface border border-border-color rounded-sm pl-12 pr-20 text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body" 
              placeholder="Пошук по базі знань..." 
              type="text" 
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <kbd className="font-mono text-xs text-text-muted bg-background-dark px-1.5 py-0.5 border border-border-color rounded-sm">[Ctrl+K]</kbd>
            </div>
          </div>
        </section>

        {/* Container for Grid Layout */}
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 pb-24">
          
          {/* Hot Topics Grid */}
          <section className="mb-24">
            <h2 className="font-display text-2xl mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" data-icon="local_fire_department">local_fire_department</span>
              Гарячі теми
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <Link className="group block bg-surface border border-border-color rounded-sm overflow-hidden hover-border-primary" href="#">
                <div className="h-48 border-b border-border-color bg-background-dark p-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#00E5FF 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                  <span className="material-symbols-outlined text-primary text-6xl relative z-10" data-icon="terminal">terminal</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl mb-4 group-hover:text-primary transition-colors">Основи Bash-скриптингу для DevOps</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-xs text-primary uppercase tracking-wider">5 ХВ ЧИТАННЯ</span>
                    <span className="material-symbols-outlined text-text-muted text-sm group-hover:text-primary transition-colors" data-icon="arrow_forward">arrow_forward</span>
                  </div>
                </div>
              </Link>
              {/* Card 2 */}
              <Link className="group block bg-surface border border-border-color rounded-sm overflow-hidden hover-border-primary" href="#">
                <div className="h-48 border-b border-border-color bg-background-dark p-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #00E5FF 0, #00E5FF 1px, transparent 0, transparent 50%)", backgroundSize: "10px 10px" }}></div>
                  <span className="material-symbols-outlined text-primary text-6xl relative z-10" data-icon="dns">dns</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl mb-4 group-hover:text-primary transition-colors">Docker Compose: Оркестрація локально</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-xs text-primary uppercase tracking-wider">8 ХВ ЧИТАННЯ</span>
                    <span className="material-symbols-outlined text-text-muted text-sm group-hover:text-primary transition-colors" data-icon="arrow_forward">arrow_forward</span>
                  </div>
                </div>
              </Link>
              {/* Card 3 */}
              <Link className="group block bg-surface border border-border-color rounded-sm overflow-hidden hover-border-primary" href="#">
                <div className="h-48 border-b border-border-color bg-background-dark p-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ background: "repeating-radial-gradient(circle, #00E5FF, #00E5FF 1px, transparent 1px, transparent 100%)", backgroundSize: "20px 20px" }}></div>
                  <span className="material-symbols-outlined text-primary text-6xl relative z-10" data-icon="security">security</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl mb-4 group-hover:text-primary transition-colors">Налаштування Firewall на Linux</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-xs text-primary uppercase tracking-wider">12 ХВ ЧИТАННЯ</span>
                    <span className="material-symbols-outlined text-text-muted text-sm group-hover:text-primary transition-colors" data-icon="arrow_forward">arrow_forward</span>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Main Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Feed (8 columns) */}
            <div className="lg:col-span-8">
            <h2 className="font-display text-2xl mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-text-muted" data-icon="article">article</span>
                {pageTitle}
              </h2>
              <div className="flex flex-col">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <p className="text-text-muted text-lg border-l border-border-color pl-6 py-6 mb-4">
                    Публікацій поки немає
                  </p>
                )}

                {posts.length > 0 && (
                  <div className="mt-8">
                    <button className="font-mono text-sm text-primary hover:text-white border border-border-color hover:border-primary px-6 py-3 rounded-sm transition-all bg-surface">
                      ЗАВАНТАЖИТИ БІЛЬШЕ
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar (4 columns) */}
            <div className="lg:col-span-4 lg:pl-8">
              <div className="sticky top-24">
                {/* Popular Scripts Widget */}
                <div className="bg-surface border border-border-color rounded-sm p-6 mb-8">
                  <h3 className="font-display text-lg mb-6 flex items-center gap-2 border-b border-border-color pb-4">
                    <span className="material-symbols-outlined text-primary" data-icon="code">code</span>
                    Популярні Скрипти
                  </h3>
                  <ul className="flex flex-col gap-4">
                    <li>
                      <Link className="group flex items-start gap-3" href="#">
                        <span className="material-symbols-outlined text-text-muted group-hover:text-primary mt-0.5 text-lg transition-colors" data-icon="chevron_right">chevron_right</span>
                        <div>
                          <span className="block text-sm font-medium group-hover:text-primary transition-colors mb-1">Bash: Автоматизація бекапів БД</span>
                          <span className="block text-xs text-text-muted font-mono">1.2k завантажень</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link className="group flex items-start gap-3" href="#">
                        <span className="material-symbols-outlined text-text-muted group-hover:text-primary mt-0.5 text-lg transition-colors" data-icon="chevron_right">chevron_right</span>
                        <div>
                          <span className="block text-sm font-medium group-hover:text-primary transition-colors mb-1">Python: Моніторинг SSL сертифікатів</span>
                          <span className="block text-xs text-text-muted font-mono">850 завантажень</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link className="group flex items-start gap-3" href="#">
                        <span className="material-symbols-outlined text-text-muted group-hover:text-primary mt-0.5 text-lg transition-colors" data-icon="chevron_right">chevron_right</span>
                        <div>
                          <span className="block text-sm font-medium group-hover:text-primary transition-colors mb-1">PS: Очищення старих логів IIS</span>
                          <span className="block text-xs text-text-muted font-mono">620 завантажень</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link className="group flex items-start gap-3" href="#">
                        <span className="material-symbols-outlined text-text-muted group-hover:text-primary mt-0.5 text-lg transition-colors" data-icon="chevron_right">chevron_right</span>
                        <div>
                          <span className="block text-sm font-medium group-hover:text-primary transition-colors mb-1">Docker: Cleanup script (prune)</span>
                          <span className="block text-xs text-text-muted font-mono">2.1k завантажень</span>
                        </div>
                      </Link>
                    </li>
                  </ul>
                  <Link className="inline-flex items-center gap-2 mt-6 text-sm text-primary hover:text-white font-mono transition-colors" href="#">
                    Всі скрипти <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
                  </Link>
                </div>
                
                {/* Telegram CTA */}
                <Link className="block w-full bg-secondary hover:bg-[#b3e600] text-background-dark text-center py-4 rounded-sm font-mono font-bold text-sm tracking-wider uppercase transition-colors flex justify-center items-center gap-2" href="#">
                  <span className="material-symbols-outlined" data-icon="send">send</span>
                  Підписатися на Telegram
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
