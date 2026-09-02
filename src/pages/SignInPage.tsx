import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';

export function SignInPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [submitted, setSubmitted] = useState(false); const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const submit = (event: FormEvent) => { event.preventDefault(); const next = { email: email ? undefined : 'Enter your email address.', password: password ? undefined : 'Enter your password.' }; setErrors(next); if (!next.email && !next.password) setSubmitted(true); };
  return <AuthLayout title="Welcome back." subtitle="Your sketchbook is still open.">{submitted ? <p className="success-message">You’re signed in for this preview.</p> : <form className="auth-form" noValidate onSubmit={submit}><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <p id="email-error" className="form-error">{errors.email}</p>}<label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby={errors.password ? 'password-error' : undefined} />{errors.password && <p id="password-error" className="form-error">{errors.password}</p>}<button className="button button-dark" type="submit">Sign in <span>→</span></button><p className="auth-switch">New to Atelier? <Link to="/sign-up">Create an account</Link></p></form>}</AuthLayout>;
}
