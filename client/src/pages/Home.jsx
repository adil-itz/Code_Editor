import React from 'react';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { Workflow } from '../components/home/Workflow';
import { LanguageShowcase } from '../components/home/LanguageShowcase';
import { DeveloperExperience } from '../components/home/DeveloperExperience';
import { TerminalPreview } from '../components/home/TerminalPreview';
import { FinalCTA } from '../components/home/FinalCTA';

export function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Workflow />
      <LanguageShowcase />
      <DeveloperExperience />
      <TerminalPreview />
      <FinalCTA />
    </main>
  );
}
