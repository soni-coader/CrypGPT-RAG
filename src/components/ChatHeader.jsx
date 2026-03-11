/**
 * Chat header component
 * Displays title, subtitle, and mobile menu toggle
 */
import logo from '../assets/logo/logo 1.png';

export function ChatHeader({ onMenuClick, tokenData }) {
  return (
    <div className="bg-[#202123] border-b border-white/[0.06] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="md:hidden text-white/60 hover:text-white transition flex-shrink-0 p-1"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={logo}
                alt="CrypGPT"
                className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0 object-contain hidden sm:block"
              />
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">CrypGPT AI Assistant</h2>
                <p className="text-xs md:text-sm text-white/60">
                  Ask anything about CrypGPT token and ecosystem
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile token info */}
      {tokenData && (
        <div className="md:hidden grid grid-cols-3 gap-3 p-3 bg-[#343541] rounded-xl border border-white/[0.06]">
          <div className="text-center">
            <p className="text-xs text-white/60 font-medium">Price</p>
            <p className="text-sm font-bold text-gold">
              ${tokenData.price?.toFixed(6) || 'N/A'}
            </p>
          </div>
          <div className="text-center border-l border-r border-white/10">
            <p className="text-xs text-white/60 font-medium">Market Cap</p>
            <p className="text-sm font-bold text-[#ececec]">
              {tokenData.marketCap ? (
                tokenData.marketCap >= 1e9 ? `$${(tokenData.marketCap / 1e9).toFixed(2)}B` :
                tokenData.marketCap >= 1e6 ? `$${(tokenData.marketCap / 1e6).toFixed(1)}M` :
                `$${tokenData.marketCap.toLocaleString()}`
              ) : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/60 font-medium">24h Vol</p>
            <p className="text-sm font-bold text-[#ececec]">
              {tokenData.volume24h ? (
                tokenData.volume24h >= 1e9 ? `$${(tokenData.volume24h / 1e9).toFixed(2)}B` :
                tokenData.volume24h >= 1e6 ? `$${(tokenData.volume24h / 1e6).toFixed(1)}M` :
                `$${tokenData.volume24h.toLocaleString()}`
              ) : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
