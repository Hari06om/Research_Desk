import Navbar from '../components/Navbar.jsx';

function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(135deg,_#071018_0%,_#0f172a_45%,_#111827_100%)] px-6 py-6 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Navbar currentPath="/" onNavigate={onNavigate} />

        <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200">
              Intelligent market research
            </div>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Research companies faster with a clear, guided investment lens.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Start with a company name, review a structured research brief, compare two names side by side, and reach a decision with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/research')}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90"
              >
                Start research
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/compare')}
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/20"
              >
                Compare companies
              </button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-6 shadow-inner shadow-black/20">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              What you can do
            </div>
            <div className="mt-5 space-y-3">
              {[
                'Research a company and receive an investment verdict',
                'Review key financial signals, risks, and reasoning',
                'Compare two companies to see which one looks stronger',
                'Contact the team or share feedback directly',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
