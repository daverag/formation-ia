import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { LoadingScreen } from './components/LoadingScreen.jsx';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Chargement de votre espace..." />;
  }

  return user ? <Dashboard /> : <Login />;
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
