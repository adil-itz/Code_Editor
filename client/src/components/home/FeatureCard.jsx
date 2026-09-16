import React from 'react';

export function FeatureCard({ icon: Icon, title, description, tag }) {
  return (
    <div className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-brand-primary/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary-bg border border-border flex items-center justify-center text-brand-primary group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all duration-200">
            <Icon className="w-5 h-5" />
          </div>
          {tag && (
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-secondary-bg text-secondary-text border border-border uppercase tracking-wider">
              {tag}
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-brand-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-secondary-text leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
