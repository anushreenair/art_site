import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';

export function SignInPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!email) { setError('Enter your email address.'); return; }
    if (!password) { setError('Enter your password.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Sign in failed.'); return; }
      setSubmitted(true);
      navigate('/', { replace: true });
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };
  return <AuthLayout title="Welcome back." subtitle="Your sketchbook is still open.">
    {submitted ? <p className="success-message">You're signed in. Welcome back.</p> :
    <form className="auth-form" noValidate onSubmit={submit}>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} />
      {error && <p className="form-error">{error}</p>}
      <button className="button button-dark" type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in <span>→</span>'}
      </button>
      <p className="auth-switch">New to Atelier? <Link to="/sign-up">Create an account</Link></p>
    </form>}
  </AuthLayout>;
}
