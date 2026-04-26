import { Link } from 'react-router-dom';

export default function Navbar({ user, isServerUp, onLogout, navItems, currentPath }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-stone-950/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between px-6 py-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-primary/20 flex items-center justify-center text-primary font-serif italic text-lg">
            {user?.name?.[0]?.toUpperCase() || 'F'}
          </div>
          <div>
            <h1 className="font-serif font-bold text-stone-100 italic text-xl tracking-tight">Fenmo Tracker</h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-stone-400">
              <span className={`inline-block w-2 h-2 rounded-full ${isServerUp ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span>{isServerUp ? 'API online' : 'API offline'}</span>
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-center px-3 py-2 rounded-full active:scale-90 duration-200 ${
                  isActive ? 'text-orange-400 bg-orange-400/10' : 'text-stone-400 hover:bg-stone-800/50'
                }`}
                title={item.name}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span className="font-sans uppercase tracking-widest text-[9px] font-bold ml-1.5 hidden lg:inline">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/add"
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_10px_30px_rgba(240,160,71,0.35)] hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="font-sans uppercase tracking-widest text-[10px]">Add Expense</span>
          </Link>
          <button
            onClick={onLogout}
            className="text-orange-400 hover:text-orange-300 transition-colors active:scale-95"
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
