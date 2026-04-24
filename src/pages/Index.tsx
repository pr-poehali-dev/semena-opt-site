import { useEffect, useRef, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import HeaderHero from '@/components/site/HeaderHero';
import ContentSections from '@/components/site/ContentSections';
import ContactsFooter from '@/components/site/ContactsFooter';
import { nav } from '@/components/site/data';
import useDocumentMeta from '@/hooks/useDocumentMeta';

const Index = () => {
  const [active, setActive] = useState('news');
  const lockUntilRef = useRef(0);

  useDocumentMeta({
    title: '',
    description: 'Оптовый магазин семян в Иваново: овощные, цветочные и полевые культуры. Более 560 сортов, прямые контракты с селекционными станциями, всхожесть 97%. Доставка по России. Заявки на сезон 2026.',
    ogType: 'website',
    jsonLdId: 'home-breadcrumb-jsonld',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://semena37.ru/' },
      ],
    },
  });

  const scroll = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (!el) return;
    lockUntilRef.current = Date.now() + 900;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', `#${id}`);
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && nav.some((n) => n.id === hash)) {
      lockUntilRef.current = Date.now() + 900;
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(hash);
      }, 100);
    }
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.id);

    const update = () => {
      if (Date.now() < lockUntilRef.current) return;
      const line = window.innerHeight * 0.3;
      let currentId = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - line <= 0) currentId = id;
      }
      setActive((prev) => (prev === currentId ? prev : currentId));
    };

    update();
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderHero active={active} scroll={scroll} />
      <ContentSections />
      <ContactsFooter />
      <Toaster />
    </div>
  );
};

export default Index;