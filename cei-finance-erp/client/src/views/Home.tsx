import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import Dashboard from './Dashboard';

export default function Home() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // onAuthSuccess: o listener onAuthStateChange em useAuth já atualiza `user`
    // automaticamente via Supabase, então não precisamos de callback manual
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  return <Dashboard user={user} onLogout={signOut} />;
}
