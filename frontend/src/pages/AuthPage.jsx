import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';

function AuthPage({ onNavigate }) {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => (mode === 'signin' ? 'Sign in' : 'Create account'), [mode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/signup';
      const payload = mode === 'signin'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const response = await fetch('http://localhost:3001' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      localStorage.setItem('researchDeskToken', data.token || '');
      localStorage.setItem('researchDeskUser', JSON.stringify(data.user || {}));
      setMessage(mode === 'signin' ? 'Signed in successfully.' : 'Account created successfully.');
      onNavigate('/research');
    } catch (err) {
      setMessage(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <Navbar currentPath="/auth" onNavigate={onNavigate} />

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Secure access
            </div>
            <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
              Sign in or create an account to save your research flow.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">
              Authentication is connected to your MongoDB database, so each account is stored and can be used for future sessions.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6 shadow-inner shadow-black/20">
            <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              <button type="button" onClick={() => setMode('signin')} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'signin' ? 'bg-white text-slate-900' : 'text-slate-300'}`}>
                Sign in
              </button>
              <button type="button" onClick={() => setMode('signup')} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-slate-900' : 'text-slate-300'}`}>
                Sign up
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  required
                />
              )}

              <input
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                type="email"
                placeholder="Email"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                required
              />

              <input
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                type="password"
                placeholder="Password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                required
              />

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? 'Please wait…' : title}
              </button>
            </form>

            {message && (
              <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                {message}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPage;
