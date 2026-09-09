import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';

export function SignUpPage() {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!values.name.trim() || !values.email.trim() || values.password.length < 8) {
      setError('Add your name, email, and a password with at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Could not create account.'); return; }
      setComplete(true);
      navigate('/', { replace: true });
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Make room for your work." subtitle="Create a practice that belongs to you.">
    {complete ? <div className="success-message"><p>Your studio is ready.</p><Link className="button button-dark" to="/onboarding">Set up my practice <span>→</span></Link></div> :
    <form className="auth-form" noValidate onSubmit={submit}>
      <label htmlFor="name">Your name</label>
      <input id="name" autoComplete="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} disabled={loading} />
      <label htmlFor="new-email">Email address</label>
      <input id="new-email" type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} disabled={loading} />
      <label htmlFor="new-password">Password</label>
      <input id="new-password" type="password" autoComplete="new-password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} disabled={loading} />
      {error && <p className="form-error">{error}</p>}
      <button className="button button-dark" type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account <span>→</span>'}
      </button>
      <p className="auth-switch">Already a member? <Link to="/sign-in">Sign in</Link></p>
    </form>}
  </AuthLayout>;
}
