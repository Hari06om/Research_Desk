const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Research', path: '/research' },
  { label: 'Comparison', path: '/compare' },
  { label: 'Contact', path: '/contact' },
];

function getInitial(user) {
  const source = user?.name || user?.email || 'U';
  return source.trim().charAt(0).toUpperCase() || 'U';
}

function Navbar({ currentPath, onNavigate, user, onLogout }) {
  const items = user ? NAV_ITEMS : [...NAV_ITEMS, { label: 'Login', path: '/auth' }];

  return (
    <nav className="sticky top-4 z-30 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-3 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="rounded-xl px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
        >
          AI Research Desk
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {items.map((item) => {
            const active = currentPath === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {user && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('/profile')}
                aria-label="Open profile"
                className="ml-1 grid h-10 w-10 place-items-center rounded-full border border-emerald-200 bg-emerald-100 text-sm font-black text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-200"
                title={user.name || user.email}
              >
                {getInitial(user)}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
