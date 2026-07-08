const FMP_BASE = "https://financialmodelingprep.com/api/v3";

/**
 * Pulls structured fundamentals for a company from Financial Modeling Prep
 * (free tier: https://financialmodelingprep.com). Unlike the web-search
 * fallback, this gives exact numbers (market cap, P/E, revenue, margins)
 * when the company is public.
 *
 * Returns `null` if the company has no public ticker (private company,
 * startup, etc.) — callers should treat that as a normal case, not an
 * error, and fall back to search-derived signal instead.
 */
export async function getStructuredFinancials(companyName) {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    console.warn("FMP_API_KEY not set — skipping structured financials, using search fallback only.");
    return null;
  }

  try {
    const ticker = await resolveTicker(companyName, apiKey);
    if (!ticker) return null;

    const [profile, quote] = await Promise.all([
      fetchJson(`${FMP_BASE}/profile/${ticker}?apikey=${apiKey}`),
      fetchJson(`${FMP_BASE}/quote/${ticker}?apikey=${apiKey}`),
    ]);

    const p = profile?.[0];
    const q = quote?.[0];
    if (!p && !q) return null;

    return {
      ticker,
      companyName: p?.companyName || companyName,
      sector: p?.sector,
      industry: p?.industry,
      description: p?.description,
      marketCap: q?.marketCap ?? p?.mktCap,
      price: q?.price,
      peRatio: q?.pe,
      eps: q?.eps,
      priceChangePercent: q?.changesPercentage,
      yearHigh: q?.yearHigh,
      yearLow: q?.yearLow,
      volume: q?.volume,
      avgVolume: q?.avgVolume,
    };
  } catch (err) {
    console.error(`getStructuredFinancials failed for "${companyName}":`, err.message);
    return null;
  }
}

async function resolveTicker(companyName, apiKey) {
  const results = await fetchJson(
    `${FMP_BASE}/search?query=${encodeURIComponent(companyName)}&limit=1&apikey=${apiKey}`
  );
  return results?.[0]?.symbol || null;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FMP request failed: ${res.status}`);
  return res.json();
}
