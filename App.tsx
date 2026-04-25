import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Generator from './pages/Generator';

type Page = 'landing' | 'auth' | 'dashboard' | 'editor' | 'generator';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && currentPage === 'landing') {
        // keep on landing, let user choose
      }
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && (currentPage === 'dashboard' || currentPage === 'editor' || currentPage === 'generator')) {
        setCurrentPage('auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [currentPage]);

  const navigate = async (page: string) => {
    const protectedPages: Page[] = ['dashboard', 'editor', 'generator'];
    if (protectedPages.includes(page as Page)) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCurrentPage('auth');
        return;
      }
    }
    setCurrentPage(page as Page);
    if (page !== 'editor') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="dot-loading">
          <span /><span /><span />
        </div>
      </div>
    );
  }

  const showNavbar = currentPage !== 'editor';
  const needsTopPad = showNavbar && currentPage !== 'landing';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {showNavbar && <Navbar currentPage={currentPage} onNavigate={navigate} />}

      <div style={{ paddingTop: needsTopPad ? 60 : 0 }}>
        {currentPage === 'landing' && <Landing onNavigate={navigate} />}
        {currentPage === 'auth' && <Auth onNavigate={navigate} />}
        {currentPage === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {currentPage === 'editor' && <Editor onNavigate={navigate} />}
        {currentPage === 'generator' && <Generator onNavigate={navigate} />}
      </div>
    </div>
  );
}
