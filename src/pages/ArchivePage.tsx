import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { archive } from '@/components/site/data';

const ArchivePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--forest))] grid place-items-center">
              <Icon name="Sprout" size={20} className="text-[hsl(var(--lime))]" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl font-semibold">Семена Оптом</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">с 2009 года</div>
            </div>
          </Link>
          <Link to="/">
            <Button variant="outline" className="rounded-full">
              <Icon name="ArrowLeft" size={16} />
              На главную
            </Button>
          </Link>
        </div>
      </header>

      <section className="container py-24 lg:py-32">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[hsl(var(--earth))] mb-3">Архив</div>
          <h1 className="font-display text-5xl lg:text-7xl leading-[0.95]">
            Архив <em className="text-[hsl(var(--earth))]">новостей</em>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Все прошлые поступления, события и обновления компании. Новые записи появляются еженедельно.
          </p>
        </div>

        <div className="divide-y divide-border/60 border-y border-border/60">
          {archive.map((a, i) => (
            <Link
              key={i}
              to={`/archive/${a.slug}`}
              className="flex items-center justify-between py-5 group cursor-pointer hover:pl-4 transition-all"
            >
              <div className="flex items-baseline gap-8">
                <div className="text-xs uppercase tracking-wider text-muted-foreground w-32 shrink-0">{a.date}</div>
                <div className="font-display text-xl">{a.title}</div>
              </div>
              <Icon name="ArrowUpRight" size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArchivePage;