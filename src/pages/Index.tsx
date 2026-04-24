import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import HeaderHero from '@/components/site/HeaderHero';
import ContentSections from '@/components/site/ContentSections';
import ContactsFooter from '@/components/site/ContactsFooter';
import { nav } from '@/components/site/data';

const Index = () => {
  const [active, setActive] = useState('news');

  const scroll = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', `#${id}`);
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && nav.some((n) => n.id === hash)) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(hash);
      }, 100);
    }
  }, []);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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