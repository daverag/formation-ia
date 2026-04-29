import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import PublicHome from './pages/PublicHome.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { LoadingScreen } from './components/LoadingScreen.jsx';

function AppContent() {
  const { user, loading } = useAuth();
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (loading) {
    return <LoadingScreen message="Chargement de votre espace..." />;
  }

  if (path === '/dashboard') {
    return user ? <Dashboard /> : <Login />;
  }

  return <PublicHome isAuthenticated={Boolean(user)} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
