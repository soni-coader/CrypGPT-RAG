import { useState, useEffect, useCallback } from 'react';

const CMC_API_KEY = import.meta.env.VITE_CMC_API_KEY || '';
const CMC_BASE = (import.meta.env.VITE_CMC_API_BASE || 'https://pro-api.coinmarketcap.com/v1').replace(/\/$/, '');
// Token ID as in backend (CMC portal) – used as key in response data
const TOKEN_ID = (import.meta.env.VITE_CMC_TOKEN_ID || '38439').trim();
const CMC_SYMBOL = (import.meta.env.VITE_CMC_SYMBOL || 'BTC').toUpperCase();

/**
 * Use proxy in dev to avoid CORS (browser → Vite → CMC).
 * In production, if you build and host static, set VITE_CMC_USE_PROXY=false and ensure CMC allows CORS, or use a server proxy.
 */
const USE_PROXY = import.meta.env.VITE_CMC_USE_PROXY !== 'false';
const CMC_FETCH_BASE =
  USE_PROXY ? '/api/cmc/v1' : CMC_BASE;

/**
 * Map CMC token + quote to our tokenData shape (matches backend realTimeDataService logic).
 * Uses self_reported_market_cap / self_reported_circulating_supply when present.
 */
function mapCmcToTokenData(token, quote, symbolLabel) {
  if (!quote) return null;
  const price = quote.price ?? 0;
  const selfReported =
    quote.self_reported_market_cap ??
    (token.self_reported_circulating_supply
      ? price * token.self_reported_circulating_supply
      : 0);
  const marketCap = selfReported !== undefined && selfReported !== null && selfReported !== 0
    ? selfReported
    : (quote.market_cap ?? 0);

  return {
    price,
    marketCap,
    volume24h: quote.volume_24h ?? 0,
    source: 'coinmarketcap',
    symbol: symbolLabel,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Fetch token data from CoinMarketCap (same contract as backend realTimeDataService).
 * No backend – uses Vite proxy in dev to avoid CORS.
 */
export function useTokenData() {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTokenData = useCallback(async () => {
    if (!CMC_API_KEY.trim()) {
      setError('CMC API key not set. Add VITE_CMC_API_KEY in .env');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const byId = TOKEN_ID.length > 0;
      const qs = byId
        ? `id=${encodeURIComponent(TOKEN_ID)}&convert=USD`
        : `symbol=${encodeURIComponent(CMC_SYMBOL)}&convert=USD`;
      const url = `${CMC_FETCH_BASE}/cryptocurrency/quotes/latest?${qs}`;

      const res = await fetch(url, {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          Accept: 'application/json'
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`CoinMarketCap API error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const dataObj = data?.data;
      if (!dataObj || typeof dataObj !== 'object') {
        throw new Error(
          byId ? `No data for token ID: ${TOKEN_ID}` : `No data for symbol: ${CMC_SYMBOL}`
        );
      }

      const dataKey = byId ? String(TOKEN_ID) : CMC_SYMBOL;
      const token = dataObj[dataKey];
      if (!token) {
        throw new Error(
          byId ? `Token data not found in CoinMarketCap response for ID: ${TOKEN_ID}` : `Token not found for symbol: ${CMC_SYMBOL}`
        );
      }

      const quote = token?.quote?.USD;
      if (!quote) {
        throw new Error('USD quote not found in CoinMarketCap response');
      }

      const symbolLabel = token.symbol || dataKey;
      const mapped = mapCmcToTokenData(token, quote, symbolLabel);
      setTokenData(mapped);
    } catch (err) {
      console.error('CoinMarketCap fetch failed:', err?.message ?? err);
      setError(err instanceof Error ? err.message : 'Failed to fetch token data');
      setTokenData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokenData();
  }, [fetchTokenData]);

  return { tokenData, loading, error, refresh: fetchTokenData };
}
