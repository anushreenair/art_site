import { useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [{ label: 'Explore', to: '/explore' }, { label: 'Practice', to: '/' }, { label: 'Challenges', to: '/' }, { label: 'Community', to: '/' }];
  return <><a className="skip-link" href="#content">Skip to content</a><header className="site-header"><Link to="/" className="wordmark">atelier<span>·</span></Link><button className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'Close' : 'Menu'}</button><nav id="primary-navigation" className={menuOpen ? 'open' : ''} aria-label="Primary">{links.map((link) => <NavLink key={link.label} to={link.to} onClick={() => setMenuOpen(false)}>{link.label}</NavLink>)}<Link className="header-sign-in" to="/sign-in">Sign in <span>↗</span></Link></nav></header><main id="content">{children}</main></>;
}
