import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useMe } from '../hooks/useMe';

export default function Profile() {
  const { isAuth, logout } = useAuth();
  const { data: me, isLoading, isError, error } = useMe(isAuth);

  return (
    <Layout>
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-10">
        <section className="glass-card rounded-[2rem] p-8 md:p-10 border border-outline-variant/10">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="font-sans uppercase text-[10px] tracking-[0.2em] text-on-surface-variant">Account</p>
              <h2 className="font-serif text-4xl text-on-surface">My Profile</h2>
            </div>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-full bg-red-500/15 text-red-300 text-xs uppercase tracking-wider font-bold hover:bg-red-500/25 transition-colors"
            >
              Logout
            </button>
          </div>

          {isLoading ? (
            <p className="text-on-surface-variant">Loading profile from `/api/auth/me`...</p>
          ) : isError ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">
              Failed to load profile: {error?.message || 'Unknown error'}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField label="Name" value={me?.name} />
                <ProfileField label="Email" value={me?.email} />
              </div>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-4">
      <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
      <p className="text-sm text-on-surface">{value || '-'}</p>
    </div>
  );
}
