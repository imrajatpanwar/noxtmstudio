import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import Chatbot from './Chatbot.jsx';

export default function PublicLayout() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar settings={settings} />
      <main className="flex-1">
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
      <Chatbot />
    </div>
  );
}
