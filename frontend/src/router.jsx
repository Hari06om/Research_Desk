import { useMemo, useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ComparePage from './pages/ComparePage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/research';

function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [researchResult, setResearchResult] = useState(null);

  function navigate(path) {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  }

  const page = useMemo(() => {
    if (currentPath === '/' || currentPath === '') {
      return <LandingPage onNavigate={navigate} />;
    }

    if (currentPath === '/research') {
      return <HomePage apiUrl={API_URL} onResearch={setResearchResult} onNavigate={navigate} />;
    }

    if (currentPath === '/compare') {
      return <ComparePage apiUrl={API_URL} onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (currentPath === '/auth') {
      return <AuthPage onNavigate={navigate} />;
    }

    return <NotFoundPage />;
  }, [currentPath, researchResult]);

  return <div>{page}</div>;
}

export default Router;
