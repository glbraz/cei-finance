import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import Dashboard from './Dashboard';

/**
 * Página principal que gerencia a autenticação e o dashboard
 */
export default function Home() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return <Dashboard user={user} onLogout={handleLogout} />;
}
