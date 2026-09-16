import React from 'react';
import { Hero } from '../components/hero/Hero';
import { WriteSection } from '../components/sections/WriteSection';
import { RunSection } from '../components/sections/RunSection';
import { PreviewSection } from '../components/sections/PreviewSection';
import { ProjectSection } from '../components/sections/ProjectSection';
import { LanguageSection } from '../components/sections/LanguageSection';
import { CommandPaletteSection } from '../components/sections/CommandPaletteSection';
import { KeyboardSection } from '../components/sections/KeyboardSection';
import { EcosystemSection } from '../components/sections/EcosystemSection';
import { WorkflowSection } from '../components/sections/WorkflowSection';
import { CredibilitySection } from '../components/sections/CredibilitySection';
import { CapabilitiesSection } from '../components/sections/CapabilitiesSection';

export function Home() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand-primary/20 selection:text-brand-primary">
      <Hero />
      <WriteSection />
      <RunSection />
      <PreviewSection />
      <ProjectSection />
      <LanguageSection />
      <CommandPaletteSection />
      <KeyboardSection />
      <EcosystemSection />
      <WorkflowSection />
      <CredibilitySection />
      <CapabilitiesSection />
    </main>
  );
}
