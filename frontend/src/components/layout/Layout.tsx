import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useRef, useState, useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLegalPage = location.pathname === '/terminos' || location.pathname === '/privacidad' || location.pathname === '/cookies';
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Mide la altura real del header y la actualiza si cambia el tamaño de ventana
  useEffect(() => {
    if (isAuthPage || isLegalPage || isLandingPage) return;

    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isAuthPage, isLegalPage, isLandingPage]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {!isAuthPage && !isLegalPage && (
        <div
          ref={headerRef}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <Header />
        </div>
      )}

      {/* Espaciador con la altura exacta del header para que el contenido no quede tapado */}
      {!isAuthPage && !isLegalPage && !isLandingPage && headerHeight > 0 && (
        <div style={{ height: headerHeight, flexShrink: 0 }} />
      )}

      <main className={isLandingPage ? '' : 'flex-grow'}>
        <Outlet />
      </main>

      {!isAuthPage && !isLegalPage && (
        <div className={isLandingPage ? 'relative z-50' : ''}>
          <Footer />
        </div>
      )}
    </div>
  );
}