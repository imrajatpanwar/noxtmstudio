import { useEffect, useRef, useState } from 'react';
import api from '../api.js';

function getVisitorId() {
  let id = localStorage.getItem('noxtm_visitor');
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('noxtm_visitor', id);
  }
  return id;
}

export default function Chatbot() {
  const [config, setConfig] = useState(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    api.get('/chat/config').then((r) => setConfig(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (open && config && messages.length === 0) {
      setMessages([{ from: 'bot', text: config.welcome }]);
    }
  }, [open, config]);

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [messages, open]);

  if (!config?.enabled) return null;

  const send = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || sending) return;
    setMessages((m) => [...m, { from: 'user', text: value }]);
    setText('');
    setSending(true);
    try {
      const { data } = await api.post('/chat/message', {
        visitorId: getVisitorId(),
        text: value,
      });
      setMessages((m) => [...m, { from: 'bot', text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: 'Connection issue — try again.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[26rem] w-[21rem] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl">
          <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-3">
            <span className="text-sm font-semibold">{config.title}</span>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-white">✕</button>
          </div>
          <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'text-right' : 'text-left'}>
                <span
                  className={`inline-block max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === 'user' ? 'bg-accent text-ink' : 'bg-ink text-white'
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="field py-2"
            />
            <button className="btn-primary px-4 py-2" disabled={sending}>→</button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#3A5E48] text-white shadow-xl transition hover:bg-[#22372B]"
        aria-label="Open chat"
      >
        {open ? '✕' : '💬'}
      </button>
    </>
  );
}
