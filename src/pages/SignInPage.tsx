import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';

export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; otp?: string }>({});
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (otpRequired) {
      if (!/^\d{6}$/.test(otp)) {
        setFieldErrors({ otp: 'Enter the 6-digit passcode.' });
        return;
      }
      setFieldErrors({});
    }
    const next = {
      email: email.trim() ? undefined : 'Enter your email address.',
      password: password ? undefined : 'Enter your password.',
    };
    setFieldErrors(next);
    if (!otpRequired && (next.email || next.password)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...(otpRequired ? { otp } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Sign in failed.'); return; }
      if (data.otpRequired) {
        setPendingName(data.name ?? '');
        setOtpRequired(true);
        return;
      }
      window.localStorage.setItem('atelier-auth-user', JSON.stringify({ id: data.userId, name: data.name, email: email.trim().toLowerCase() }));
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
      {otpRequired ? <>
        <p className="auth-subtitle">Check your email for the 6-digit passcode{pendingName ? `, ${pendingName.split(' ')[0]}` : ''}.</p>
        <label htmlFor="otp">One-time passcode</label>
        <input id="otp" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} disabled={loading} aria-describedby={fieldErrors.otp ? 'otp-error' : undefined} />
        {fieldErrors.otp && <p id="otp-error" className="form-error">{fieldErrors.otp}</p>}
      </> : <>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} aria-describedby={fieldErrors.email ? 'email-error' : undefined} />
      {fieldErrors.email && <p id="email-error" className="form-error">{fieldErrors.email}</p>}
      <label htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} aria-describedby={fieldErrors.password ? 'password-error' : undefined} />
      {fieldErrors.password && <p id="password-error" className="form-error">{fieldErrors.password}</p>}
      </>}
      {error && <p className="form-error">{error}</p>}
      <button className="button button-dark" type="submit" disabled={loading}>
        {loading ? (otpRequired ? 'Verifying…' : 'Signing in…') : <>{otpRequired ? 'Verify' : 'Sign in'} <span>→</span></>}
      </button>
      <p className="auth-switch">New to Atelier? <Link to="/sign-up">Create an account</Link></p>
    </form>}
  </AuthLayout>;
}
