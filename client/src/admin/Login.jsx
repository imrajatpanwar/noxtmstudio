import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function AdminLogin() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      nav('/admin');
    } catch {
      setError('Invalid email or password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-light flex min-h-screen items-center justify-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-8">
        <div className="mb-6 text-center">
          <div className="font-display text-2xl font-bold text-[#1A1A18]">NOXTM<span className="text-[#3A5E48]">.</span></div>
          <p className="mt-1 text-sm text-black/40">Admin panel</p>
        </div>
        <label className="label">Email</label>
        <input className="field mb-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label">Password</label>
        <input className="field mb-5" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
