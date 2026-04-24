import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { faqCategories, faqIntro } from '@/components/site/faq';
import SiteLogo from '@/components/site/SiteLogo';
import useDocumentMeta from '@/hooks/useDocumentMeta';

const FaqPage = () => {
  const [active, setActive] = useState(faqCategories[0].id);
  const current = faqCategories.find((c) => c.id === active) ?? faqCategories[0];

  const allFaqItems = faqCategories.flatMap((c) => c.items);

  useDocumentMeta({
    title: 'Вопросы и ответы',
    description: 'Ответы на частые вопросы об оптовом заказе семян: условия доставки, сроки, оплата, подбор сортов под регион. Огурцы, томаты, зелень и другие культуры.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'ru-RU',
      mainEntity: allFaqItems.map((it) => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: it.a,
        },
      })),
    },
    jsonLdId: 'faq-page-jsonld',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="container flex items-center justify-between h-14 sm:h-16 gap-3">
          <SiteLogo to="/" />
          <Link to="/">
            <Button variant="outline" className="rounded-full h-9 sm:h-10 px-3 sm:px-4 text-sm">
              <Icon name="ArrowLeft" size={16} />
              <span className="hidden sm:inline">На главную</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-12 sm:py-20 lg:py-28">
        <div className="mb-8 sm:mb-12 max-w-3xl">
          <Badge className="mb-4 sm:mb-6 bg-[hsl(var(--lime))]/20 text-[hsl(var(--forest))] border-0 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 hover:bg-[hsl(var(--lime))]/30 text-xs sm:text-sm">
            FAQ
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95] mb-4 sm:mb-8">
            Вопросы и <em className="text-[hsl(var(--earth))]">ответы</em>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {faqIntro}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-2">
              <div className="text-xs uppercase tracking-[0.25em] text-[hsl(var(--earth))] mb-3 sm:mb-4">Разделы</div>
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`w-full flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all text-left ${
                    active === cat.id
                      ? 'bg-[hsl(var(--forest))] text-[hsl(var(--cream))]'
                      : 'bg-card hover:bg-muted border border-border/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full grid place-items-center shrink-0 ${active === cat.id ? 'bg-[hsl(var(--lime))]/20' : 'bg-[hsl(var(--lime))]/30'}`}>
                      <Icon name={cat.icon} size={18} className={active === cat.id ? 'text-[hsl(var(--lime))]' : 'text-[hsl(var(--forest))]'} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-base sm:text-lg leading-tight">{cat.title}</div>
                      <div className={`text-xs ${active === cat.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                        {cat.items.length} {cat.items.length === 1 ? 'вопрос' : cat.items.length < 5 ? 'вопроса' : 'вопросов'}
                      </div>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={18} className={`shrink-0 ${active === cat.id ? 'opacity-100' : 'opacity-40'}`} />
                </button>
              ))}
            </div>
          </aside>

          <div className="lg:col-span-8">
            <Card className="p-5 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl border-border/60">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border/60">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[hsl(var(--lime))]/30 grid place-items-center shrink-0">
                  <Icon name={current.icon} size={24} className="text-[hsl(var(--forest))]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.25em] text-[hsl(var(--earth))] mb-1">Раздел</div>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl leading-tight">{current.title}</h2>
                </div>
              </div>

              <div className="space-y-2">
                {current.items.map((item, i) => (
                  <details
                    key={`${current.id}-${i}`}
                    className="group border border-border/60 rounded-xl sm:rounded-2xl px-4 sm:px-5 open:bg-muted/40 transition-colors"
                  >
                    <summary className="cursor-pointer flex items-start justify-between gap-3 sm:gap-4 py-4 sm:py-5 font-display text-base sm:text-lg leading-snug list-none [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <Icon
                        name="Plus"
                        size={20}
                        className="shrink-0 mt-0.5 sm:mt-1 text-[hsl(var(--forest))] transition-transform group-open:rotate-45"
                      />
                    </summary>
                    <div className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-4 sm:pb-5 pt-1 pr-6 sm:pr-8">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>

              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Не нашли ответ?</div>
                  <div className="font-display text-lg sm:text-xl">Задайте вопрос менеджеру</div>
                </div>
                <Link to="/#contacts" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-full bg-[hsl(var(--forest))] hover:bg-[hsl(var(--forest))]/90 text-[hsl(var(--cream))] h-12 sm:h-14 px-6 sm:px-8">
                    Оставить заявку
                    <Icon name="ArrowRight" size={18} />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FaqPage;