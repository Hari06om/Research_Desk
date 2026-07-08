import { useEffect, useRef, useState } from 'react';

const EXAMPLE_COMPANIES = ['Zomato', 'Nvidia', 'Paytm'];
const TRACE_STEPS = [
  'Gathering news coverage…',
  'Pulling financial data + signals…',
  'Synthesizing research brief…',
  'Weighing the decision…',
  'Running a self-check on the verdict…',
];

const formatExecutiveSummary = (text) => {
  if (!text) return [];

  const cleaned = String(text)
    .replace(/\*\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return [];

  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  const paragraphs = [];
  let current = '';

  sentences.forEach((sentence) => {
    if (!current) {
      current = sentence;
      return;
    }

    if (current.length + sentence.length < 220) {
      current += ` ${sentence}`;
    } else {
      paragraphs.push(current);
      current = sentence;
    }
  });

  if (current) paragraphs.push(current);

  return paragraphs.length > 0 ? paragraphs : [cleaned];
};

function HomePage({ apiUrl, onResearch, onNavigate }) {
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const dossierRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      setVisibleSteps([]);
      return;
    }

    let stepIdx = 0;
    setVisibleSteps([{ text: TRACE_STEPS[0], done: false }]);
    stepIdx = 1;

    const interval = window.setInterval(() => {
      if (stepIdx >= TRACE_STEPS.length) {
        window.clearInterval(interval);
        return;
      }

      setVisibleSteps((prev) => {
        const updated = prev.map((step, idx) =>
          idx === prev.length - 1 ? { ...step, done: true } : step
        );
        return [...updated, { text: TRACE_STEPS[stepIdx], done: false }];
      });
      stepIdx += 1;
    }, 800);

    return () => window.clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (result?.decision && dossierRef.current) {
      window.setTimeout(() => {
        dossierRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  async function runAgent(name) {
    const target = (name ?? company).trim();
    if (!target) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: target }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setResult(data);
        onResearch?.(data);
      }
    } catch (err) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  }

  const verdict = result?.decision?.verdict;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="rounded-full border border-white/10 bg-slate-900/70 p-1 shadow-lg shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
            <button type="button" onClick={() => onNavigate?.('/')} className="rounded-full px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10">Research Desk</button>
            <div className="flex flex-wrap gap-2">
              {['/', '/research', '/compare', '/contact'].map((path) => {
                const label = path === '/' ? 'Home' : path === '/research' ? 'Research' : path === '/compare' ? 'Comparison' : 'Contact';
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => onNavigate?.(path)}
                    className={`rounded-full px-3 py-2 text-sm transition ${active ? 'bg-white text-slate-900' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="max-w-3xl animate-[fadeIn_0.7s_ease-both]">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Research Desk / Automated Coverage
          </div>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Tell it a company. It comes back with a verdict.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Enter a company name, and the agent researches the business, reviews recent news and financial signals, and then decides whether to invest or pass — with the reasoning behind that decision clearly shown.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-center" id="terminal-input">
          <span className="text-lg text-amber-400">&gt;</span>
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && runAgent()}
            placeholder="Enter a company name, e.g. Zomato"
            disabled={loading}
            id="company-input"
            className="w-full border-none bg-transparent font-mono text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => runAgent()}
              disabled={loading || !company.trim()}
              id="run-button"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Researching…' : 'Run research'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('/compare')}
              className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/20"
            >
              Compare companies
            </button>
          </div>
        </div>

        {!result && !loading && !error && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-slate-500">
                try:
              </span>
              {EXAMPLE_COMPANIES.map((item) => (
                <span
                  key={item}
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
                  onClick={() => {
                    setCompany(item);
                    runAgent(item);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      setCompany(item);
                      runAgent(item);
                    }
                  }}
                  id={`chip-${item.toLowerCase()}`}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-400">
              <div className="mb-3 text-4xl">📊</div>
              <p>
                Type a company name above or pick an example to start your
                research.
              </p>
            </div>
          </>
        )}

        {loading && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2" id="loading-trace">
              {visibleSteps.map((step, index) => (
                <div className="flex items-center gap-3 font-mono text-sm text-slate-400" key={`${step.text}-${index}`}>
                  {step.done ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-amber-400" />
                  )}
                  <span>{step.text}</span>
                </div>
              ))}
            </div>
            <div className="h-0.5 w-full animate-pulse rounded-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-300" id="error-display">
            {error}
          </div>
        )}

        {result?.decision && (
          <div className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-[#fcfaf6] via-[#f7efe2] to-[#efe3c8] p-6 text-slate-800 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.7)] sm:p-8" ref={dossierRef} id="dossier">
            <div className={`mb-6 inline-flex items-center rounded-full border px-4 py-2 font-mono text-sm font-semibold uppercase tracking-[0.2em] ${verdict === 'INVEST' ? 'border-emerald-500/40 bg-emerald-50 text-emerald-700' : verdict === 'PASS' ? 'border-rose-500/40 bg-rose-50 text-rose-700' : 'border-amber-500/40 bg-amber-50 text-amber-700'}`}>
              {verdict}
            </div>

            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Coverage initiated · {result.companyName}
            </div>
            <h2 className="font-serif text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
              {result.decision.summary}
            </h2>

            {result.structuredFinancials && (
              <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-slate-300 pb-4 font-mono text-sm text-slate-600">
                <span className="rounded bg-slate-200 px-2 py-1 font-semibold text-slate-900">
                  {result.structuredFinancials.ticker}
                </span>
                {result.structuredFinancials.price && (
                  <span>
                    ${result.structuredFinancials.price}{' '}
                    <span className={result.structuredFinancials.priceChangePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      ({result.structuredFinancials.priceChangePercent}%)
                    </span>
                  </span>
                )}
                {result.structuredFinancials.peRatio && (
                  <span>P/E {result.structuredFinancials.peRatio}</span>
                )}
                {result.structuredFinancials.marketCap && (
                  <span>Mkt Cap {formatLargeNumber(result.structuredFinancials.marketCap)}</span>
                )}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3 font-mono text-sm text-slate-600">
              <span>Confidence {result.decision.confidence}%</span>
              <div className="flex gap-1" style={{ color: colorFor(verdict) }}>
                {Array.from({ length: 20 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-3.5 w-1.5 rounded-sm ${index < Math.round(result.decision.confidence / 5) ? 'bg-current' : 'bg-slate-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Executive summary
                </div>
                <div className="space-y-3 text-base leading-8 text-slate-700">
                  {formatExecutiveSummary(result.analysis).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200/70 bg-amber-50/80 p-5 shadow-sm">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-700">
                  Why it matters
                </div>
                <div className="space-y-3 text-sm leading-7 text-slate-700">
                  <p>• The takeaway is framed around the strongest recent signals.</p>
                  <p>• Confidence is set at {result.decision.confidence}%.</p>
                  <p>• The sections below help turn the update into a fast decision brief.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Key factors
                </h3>
                <ul className="space-y-2 text-sm leading-7 text-slate-700">
                  {result.decision.keyFactors.map((factor, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Risks
                </h3>
                <ul className="space-y-2 text-sm leading-7 text-slate-700">
                  {result.decision.risks.map((risk, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm xl:col-span-3">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Reasoning
                </h3>
                <div className="whitespace-pre-wrap text-sm leading-8 text-slate-700">
                  {result.decision.reasoning}
                </div>
              </div>

              {result.decision.critique && (
                <div className={`rounded-2xl border p-5 shadow-sm xl:col-span-3 ${result.decision.critique.consistent ? 'border-emerald-500/30 bg-emerald-50/80' : 'border-amber-500/30 bg-amber-50/80'}`}>
                  <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    {result.decision.critique.consistent ? 'Self-check: passed' : 'Self-check: adjusted'}
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{result.decision.critique.note}</p>
                  {result.decision.critique.issues?.length > 0 && (
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                      {result.decision.critique.issues.map((issue, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                Sources consulted
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  {result.sources.news.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                    >
                      <span className="mb-1 block font-semibold text-slate-900">{source.title}</span>
                      <span className="block text-xs text-slate-500">{extractDomain(source.url)}</span>
                    </a>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {result.sources.financials.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                    >
                      <span className="mb-1 block font-semibold text-slate-900">{source.title}</span>
                      <span className="block text-xs text-slate-500">{extractDomain(source.url)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatLargeNumber(value) {
  if (!value) return '';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value}`;
}

function colorFor(verdict) {
  if (verdict === 'INVEST') return '#34d399';
  if (verdict === 'PASS') return '#f87171';
  return '#fbbf24';
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export default HomePage;
