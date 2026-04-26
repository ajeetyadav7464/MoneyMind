import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full mt-20 pt-12 pb-24 md:pb-12 border-t border-outline-variant/10 bg-surface-container-lowest relative overflow-hidden">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative z-10">
        
        {/* Logo & Intro */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-on-surface">Fenmo</span>
          </Link>
          <p className="text-on-surface-variant text-sm max-w-sm font-sans leading-relaxed">
            A premium, privacy-first expense tracker designed for individuals who demand elegance and performance in their financial tools.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-sans uppercase text-[10px] tracking-widest text-on-surface font-bold">Navigation</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            <li><Link to="/insights" className="hover:text-primary transition-colors">Insights</Link></li>
            <li><Link to="/vault" className="hover:text-primary transition-colors">The Vault</Link></li>
            <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
          </ul>
        </div>

        {/* Legal / Connect */}
        <div className="space-y-4">
          <h4 className="font-sans uppercase text-[10px] tracking-widest text-on-surface font-bold">Connect</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><a href="https://www.linkedin.com/in/ajeet-yadav-586180356" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a></li>
            <li><a href="https://github.com/ajeetyadav7464" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 pt-6 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant font-sans">
        <p>&copy; {year} Fenmo. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Made with <span className="material-symbols-outlined text-[12px] text-primary">favorite</span> by <span className="font-bold text-on-surface uppercase tracking-wider">Ajeet</span>
        </p>
      </div>
    </footer>
  );
}
