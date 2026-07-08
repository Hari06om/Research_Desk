import { useState } from 'react';

function ComparePage({ apiUrl, onNavigate }) {
  const [companyA, setCompanyA] = useState('');
  const [companyB, setCompanyB] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  async function runComparison() {
    const first = companyA.trim();
    const second = companyB.trim();

    if (!first || !second) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const [analysisA, analysisB] = await Promise.all([
        fetchCompanyAnalysis(apiUrl, first),
        fetchCompanyAnalysis(apiUrl, second),
      ]);

      const dataA = analysisA.data;
      const dataB = analysisB.data;

      if (!dataA || !dataB) {
        setError(analysisA.error || analysisB.error || 'Comparison failed.');
        return;
      }

      const scoredA = scoreCompany(dataA);
      const scoredB = scoreCompany(dataB);

      const winner =
        scoredA.score > scoredB.score
          ? dataA.companyName
          : scoredB.score > scoredA.score
            ? dataB.companyName
            : 'Tie';

      setResults([
        { ...dataA, score: scoredA.score, signal: scoredA.signal },
        { ...dataB, score: scoredB.score, signal: scoredB.signal },
        { winner },
      ]);
    } catch (err) {
      setError(err.message || 'Comparison failed.');
    } finally {
      setLoading(false);
    }
  }

  const winnerName = results[2]?.winner;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="rounded-full border border-white/10 bg-slate-900/70 p-1 shadow-lg shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
            <button type="button" onClick={() => onNavigate('/')} className="rounded-full px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10">Research Desk</button>
            <div className="flex flex-wrap gap-2">
              {['/', '/research', '/compare', '/contact'].map((path) => {
                const label = path === '/' ? 'Home' : path === '/research' ? 'Research' : path === '/compare' ? 'Comparison' : 'Contact';
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => onNavigate(path)}
                    className={`rounded-full px-3 py-2 text-sm transition ${active ? 'bg-white text-slate-900' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Comparison Mode
          </div>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Compare two companies and see which one looks stronger for profit potential.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">
            Enter two company names to run a side-by-side review based on the latest signals, verdicts, and momentum.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={companyA}
              onChange={(event) => setCompanyA(event.target.value)}
              placeholder="Company A"
              className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <input
              value={companyB}
              onChange={(event) => setCompanyB(event.target.value)}
              placeholder="Company B"
              className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <button
            type="button"
            onClick={runComparison}
            disabled={loading || !companyA.trim() || !companyB.trim()}
            className="mt-4 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Comparing…' : 'Compare now'}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        {results.length === 3 && (
          <div className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-6 shadow-2xl shadow-black/20">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200">
              Comparison outcome
            </div>
            <h2 className="font-serif text-2xl font-semibold text-white">
              {winnerName === 'Tie' ? 'The comparison is a tie.' : `${winnerName} looks stronger for profit potential.`}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              This view combines verdict strength, confidence, and recent price momentum to highlight the stronger opportunity.
            </p>
          </div>
        )}

        {results.length === 3 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {results.slice(0, 2).map((item) => (
              <div key={item.companyName} className="rounded-3xl border border-slate-200/80 bg-[#f8f3e8] p-6 text-slate-800 shadow-lg">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  {item.companyName}
                </div>
                <div className="mb-4 inline-flex rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-sm font-semibold text-slate-700">
                  {item.decision?.verdict || 'WATCH'}
                </div>
                <div className="space-y-2 text-sm leading-7 text-slate-700">
                  <p><span className="font-semibold">Signal score:</span> {item.score.toFixed(1)}</p>
                  <p><span className="font-semibold">Confidence:</span> {item.decision?.confidence || 0}%</p>
                  <p><span className="font-semibold">Momentum:</span> {item.structuredFinancials?.priceChangePercent ?? 0}%</p>
                  <p><span className="font-semibold">Read:</span> {item.signal}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function fetchCompanyAnalysis(apiUrl, companyName) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Research request failed.', data: null };
    }

    return { error: null, data };
  } catch (err) {
    return { error: err.message || 'Research request failed.', data: null };
  }
}

function scoreCompany(result) {
  let score = 0;
  const verdict = result?.decision?.verdict;

  if (verdict === 'INVEST') score += 5;
  else if (verdict === 'WATCH') score += 2;
  else if (verdict === 'PASS') score -= 2;

  const momentum = Number(result?.structuredFinancials?.priceChangePercent || 0);
  score += momentum / 10;

  const confidence = Number(result?.decision?.confidence || 0);
  score += confidence / 20;

  const signal =
    verdict === 'INVEST'
      ? 'Positive outlook with strong upside potential.'
      : verdict === 'PASS'
        ? 'The current profile looks weaker for profit.'
        : 'Neutral tone with mixed or early-stage signals.';

  return { score, signal };
}

export default ComparePage;
