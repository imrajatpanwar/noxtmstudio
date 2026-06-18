import { useState } from 'react';
import api from '../api.js';

const EMPTY = { name: '', email: '', company: '', phone: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/leads', { ...form, source: 'contact-form' });
      setStatus('sent');
      setForm(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A18]">

      {/* Header */}
      <section className="border-b border-black/8 bg-[#F5F2ED]">
        <div className="container-x py-16 text-center">
          <h1 className="text-4xl font-bold md:text-5xl" style={{ fontFamily: "'Gambetta', serif" }}>
            Let's build something
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-black/45">
            Tell us about your project and we'll get back within one business day.
          </p>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-2">

          {/* Left — contact info */}
          <div>
            {/* Good to know — top, no bg */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-black/25">Good to know</p>
              <p className="mt-3 text-xl font-bold leading-snug text-[#1A1A18]" style={{ fontFamily: "'Gambetta', serif" }}>
                We take on a limited number of partners each quarter.
              </p>
              <p className="mt-2 text-sm text-black/45">
                If you're serious about growth, this is your move.
              </p>
            </div>

            <h2 className="text-sm font-semibold uppercase tracking-widest text-black/30">
              Reach us directly
            </h2>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3A5E48]/10">
                  <svg className="h-4 w-4 text-[#3A5E48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-black/30">Email</p>
                  <a href="mailto:mail@noxtmstudio.com" className="text-sm font-medium text-[#1A1A18] hover:text-[#3A5E48] transition-colors">
                    mail@noxtmstudio.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3A5E48]/10">
                  <svg className="h-4 w-4 text-[#3A5E48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-black/30">Phone</p>
                  <a href="tel:+918860921042" className="text-sm font-medium text-[#1A1A18] hover:text-[#3A5E48] transition-colors">
                    +91 8860921042
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3A5E48]/10">
                  <svg className="h-4 w-4 text-[#3A5E48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-black/30">Response time</p>
                  <p className="text-sm font-medium text-[#1A1A18]">Within one business day</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right — form */}
          <form onSubmit={submit} className="rounded-2xl border border-black/6 bg-white p-6 shadow-sm space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/40">Name *</label>
                <input required value={form.name} onChange={set('name')}
                  className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] placeholder:text-black/20 outline-none focus:border-black/25" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/40">Email *</label>
                <input required type="email" value={form.email} onChange={set('email')}
                  className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] placeholder:text-black/20 outline-none focus:border-black/25" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/40">Company</label>
                <input value={form.company} onChange={set('company')}
                  className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] placeholder:text-black/20 outline-none focus:border-black/25" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/40">Phone</label>
                <input type="tel" value={form.phone} onChange={set('phone')}
                  className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] placeholder:text-black/20 outline-none focus:border-black/25" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/40">Project details</label>
              <textarea rows={5} value={form.message} onChange={set('message')}
                className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] placeholder:text-black/20 outline-none focus:border-black/25 resize-none" />
            </div>

            <button type="submit" disabled={status === 'sending'}
              className="w-full rounded-full bg-[#1A1A18] py-2.5 text-sm font-semibold text-white transition hover:bg-[#2d2d2a] disabled:opacity-50">
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'sent' && (
              <p className="text-center text-sm text-[#3A5E48] font-medium">Thanks! We'll be in touch soon.</p>
            )}
            {status === 'error' && (
              <p className="text-center text-sm text-red-500">Something went wrong. Try again.</p>
            )}
          </form>

        </div>
      </section>
    </div>
  );
}
