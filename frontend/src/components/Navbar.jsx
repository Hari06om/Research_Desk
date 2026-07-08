const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Research', path: '/research' },
  { label: 'Comparison', path: '/compare' },
  { label: 'Contact', path: '/contact' },
  { label: 'Login', path: '/auth' },
];

function Navbar({ currentPath, onNavigate }) {
  return (
    <nav className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-3 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="rounded-full px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Research Desk
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active = currentPath === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  active
                    ? 'bg-white text-slate-900'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
