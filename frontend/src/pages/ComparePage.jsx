import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';

function ComparePage({ apiUrl, onNavigate, user, onLogout }) {
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
    <div className="min-h-screen bg-[#f6f8fb] px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Navbar currentPath="/compare" onNavigate={onNavigate} user={user} onLogout={onLogout} />

        <div className="max-w-3xl">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            Comparison Mode
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Compare two companies and see which one looks stronger for profit potential.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Enter two company names to run a side-by-side review based on the latest signals, verdicts, and momentum.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)]">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={companyA}
              onChange={(event) => setCompanyA(event.target.value)}
              placeholder="Company A"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
            <input
              value={companyB}
              onChange={(event) => setCompanyB(event.target.value)}
              placeholder="Company B"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <button
            type="button"
            onClick={runComparison}
            disabled={loading || !companyA.trim() || !companyB.trim()}
            className="mt-4 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Comparing…' : 'Compare now'}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {results.length === 3 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              Comparison outcome
            </div>
            <h2 className="text-2xl font-black text-slate-950">
              {winnerName === 'Tie' ? 'The comparison is a tie.' : `${winnerName} looks stronger for profit potential.`}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              This view combines verdict strength, confidence, and recent price momentum to highlight the stronger opportunity.
            </p>
          </div>
        )}

        {results.length === 3 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {results.slice(0, 2).map((item) => (
              <div key={item.companyName} className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
                <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {item.companyName}
                </div>
                <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">
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
