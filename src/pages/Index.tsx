import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import HeaderHero from '@/components/site/HeaderHero';
import ContentSections from '@/components/site/ContentSections';
import ContactsFooter from '@/components/site/ContactsFooter';

const Index = () => {
  const [active, setActive] = useState('news');

  const scroll = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
