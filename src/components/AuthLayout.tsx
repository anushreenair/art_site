import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <div className="auth-page"><Link className="wordmark auth-mark" to="/">atelier<span>·</span></Link><section className="auth-card"><p className="eyebrow">A practice space for artists</p><h1>{title}</h1><p className="auth-subtitle">{subtitle}</p>{children}</section><p className="auth-aside">A quieter place to make the work.</p></div>;
}
