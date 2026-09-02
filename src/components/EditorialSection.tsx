import type { ReactNode } from 'react';

type Props = { eyebrow?: string; title: string; action?: ReactNode; children: ReactNode; className?: string };

export function EditorialSection({ eyebrow, title, action, children, className = '' }: Props) {
  const id = `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return <section className={`editorial-section ${className}`} aria-labelledby={id}>
    <header className="section-heading">
      <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 id={id}>{title}</h2></div>
      {action}
    </header>
    {children}
  </section>;
}
