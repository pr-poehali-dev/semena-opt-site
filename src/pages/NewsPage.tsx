import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { news as newsFallback, NEWS_API_URL } from '@/components/site/data';

interface NewsItem { slug: string; date: string; tag: string; title: string; text: string; content?: string[]; image?: string; images?: string[] }

const NewsPage = () => {
  const { slug } = useParams();
  const [items, setItems] = useState<NewsItem[]>(newsFallback);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch(NEWS_API_URL)
      .then((r) => r.json())
      .then((d) => { if (d.items?.length) setItems(d.items); })
      .catch(() => {});
  }, []);

  const item = items.find((n) => n.slug === slug);
  const gallery = item?.images || [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((i) => i === null ? null : (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => i === null ? null : (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, gallery.length]);

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
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground max-w-[260px]">магазин для юридических лиц и индивидуальных предпринимателей</div>
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

      {!item ? (
        <section className="container py-24 lg:py-32 text-center">
          <h1 className="font-display text-4xl lg:text-5xl mb-6">Новость не найдена</h1>
          <p className="text-muted-foreground mb-8">Возможно, запись была удалена или перемещена в архив.</p>
          <Link to="/">
            <Button size="lg" className="rounded-full bg-[hsl(var(--forest))] hover:bg-[hsl(var(--forest))]/90 text-[hsl(var(--cream))] h-14 px-8">
              Вернуться на главную
            </Button>
          </Link>
        </section>
      ) : (
        <article className="container py-16 lg:py-24 max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
            <Icon name="ArrowLeft" size={16} />
            Ко всем новостям
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <Badge className={`rounded-full border-0 ${item.tag === 'Поступление' ? 'bg-[hsl(var(--lime))]/30 text-[hsl(var(--forest))]' : 'bg-[hsl(var(--earth))]/20 text-[hsl(var(--earth))]'}`}>
              {item.tag}
            </Badge>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{item.date}</span>
          </div>

          <h1 className="font-display text-4xl lg:text-6xl leading-[1] mb-8">{item.title}</h1>

          {item.image && (
            <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-10">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}

          <p className="text-xl text-muted-foreground leading-relaxed mb-10 border-l-4 border-[hsl(var(--earth))] pl-6">
            {item.text}
          </p>

          <div className="space-y-6">
            {item.content?.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed">{p}</p>
            ))}
          </div>

          {gallery.length > 0 && (
            <div className="mt-12">
              <div className="text-xs uppercase tracking-[0.25em] text-[hsl(var(--earth))] mb-4">Фотогалерея</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIdx(i)}
                    className="aspect-square rounded-2xl overflow-hidden group relative"
                  >
                    <img src={img} alt={`${item.title} — фото ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-[hsl(var(--forest))]/0 group-hover:bg-[hsl(var(--forest))]/30 transition-colors grid place-items-center">
                      <Icon name="Maximize2" size={24} className="text-[hsl(var(--cream))] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Остались вопросы?</div>
              <div className="font-display text-2xl">Свяжитесь с менеджером</div>
            </div>
            <Link to="/#contacts">
              <Button size="lg" className="rounded-full bg-[hsl(var(--forest))] hover:bg-[hsl(var(--forest))]/90 text-[hsl(var(--cream))] h-14 px-8">
                Оставить заявку
                <Icon name="ArrowRight" size={18} />
              </Button>
            </Link>
          </div>
        </article>
      )}

      {lightboxIdx !== null && gallery[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => i === null ? null : (i - 1 + gallery.length) % gallery.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white transition-colors"
              >
                <Icon name="ChevronLeft" size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => i === null ? null : (i + 1) % gallery.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white transition-colors"
              >
                <Icon name="ChevronRight" size={24} />
              </button>
            </>
          )}
          <img
            src={gallery[lightboxIdx]}
            alt={`фото ${lightboxIdx + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          {gallery.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
              {lightboxIdx + 1} / {gallery.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPage;