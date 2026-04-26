import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const featureCards = [
  {
    title: 'Secure Authentication',
    desc: 'Register, login, and validate your identity with JWT-based auth and profile sync using /api/auth/me.',
    icon: 'verified_user',
  },
  {
    title: 'Expense Management',
    desc: 'Create, list, update, and delete expenses with category/date filters and idempotent create requests.',
    icon: 'receipt_long',
  },
  {
    title: 'Insights and Summary',
    desc: 'Track totals by category, monitor your spending pattern, and understand where money flows every month.',
    icon: 'analytics',
  },
  {
    title: 'Vault History',
    desc: 'View historical records with paging and drill down into each entry for edits and actions.',
    icon: 'account_balance_wallet',
  },
];

const workflowSteps = [
  'Register or login to create your secure vault session.',
  'Add expenses with amount, category, date, and description.',
  'Review dashboard and vault history with filters.',
  'Track category summaries in Insights and optimize spending.',
];

export default function Home() {
  const navigate = useNavigate();
  const categories = []; // Placeholder or derived if needed
  return (
    <Layout>
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-10 space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="glass-card rounded-[2rem] p-8 md:p-12 border border-outline-variant/10 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-12 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <p className="font-sans uppercase text-[10px] tracking-[0.2em] text-primary mb-3">Welcome Home</p>
          <h2 className="font-serif text-4xl md:text-5xl text-on-surface leading-tight mb-4">
            Fenmo helps you <span className="italic text-primary">track every rupee</span> with clarity.
          </h2>
          <p className="text-on-surface-variant max-w-3xl">
            This web app is a complete expense tracker: manage daily transactions, monitor category-wise outflow,
            and keep your records secure and organized with a modern dashboard experience.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3 relative z-20"
          >
            <button 
              onClick={() => navigate('/add')} 
              className="px-5 py-3 rounded-full bg-primary text-on-primary font-semibold text-sm glow-button cursor-pointer"
            >
              Add Expense
            </button>
            <Link to="/dashboard" className="px-5 py-3 rounded-full bg-surface-container-high text-on-surface text-sm glow-button">
              Open Dashboard
            </Link>
            <Link to="/insights" className="px-5 py-3 rounded-full bg-surface-container-high text-on-surface text-sm glow-button">
              View Insights
            </Link>
          </motion.div>
        </motion.section>

        <section className="space-y-4">
          <h3 className="font-serif text-3xl text-on-surface">Features and Functions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureCards.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-6 transition-shadow hover:shadow-[0_0_0_1px_rgba(240,160,71,0.24),0_16px_30px_rgba(0,0,0,0.25)]"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">{feature.icon}</span>
                </div>
                <h4 className="font-sans font-semibold text-on-surface mb-2">{feature.title}</h4>
                <p className="text-sm text-on-surface-variant">{feature.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-serif text-3xl text-on-surface">How Fenmo Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: index % 2 ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index + 0.2 }}
                className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-5 flex gap-4 items-start"
              >
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-4 pt-6">
          <h3 className="font-serif text-3xl text-on-surface">The Fenmo Advantage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { stat: '100%', label: 'Privacy Focused', desc: 'Your data belongs to you. No tracking, no ads, ever.' },
              { stat: '0ms', label: 'Lag Free UI', desc: 'Built on Vite and React 19 for instantaneous interactions.' },
              { stat: '24/7', label: 'Availability', desc: 'Secure cloud backups ensure your ledger is always accessible.' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                className="glass-card rounded-[2rem] p-8 text-center flex flex-col items-center justify-center border border-outline-variant/10 hover:bg-surface-container-high transition-colors"
              >
                <h4 className="font-serif text-5xl font-black text-primary mb-2 tracking-tighter">{item.stat}</h4>
                <p className="font-sans font-bold text-on-surface text-lg mb-2">{item.label}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
