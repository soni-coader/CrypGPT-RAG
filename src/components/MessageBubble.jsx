import { MessageContent } from './MessageContent';

/**
 * Individual message bubble component
 * Renders either user or assistant messages with proper styling
 */
export function MessageBubble({ message, loading }) {
  const isUser = message.type === 'user';
  const showDots = !isUser && loading && !message.content?.trim();

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-2 md:px-4`}>
        <div
          className={`text-sm ${
            isUser
              ? 'max-w-[85%] sm:max-w-md px-4 py-3 rounded-[18px] rounded-br-[3px] bg-[#303030] text-white'
              : 'w-full max-w-full py-2 text-white'
          }`}
        >
        {showDots ? (
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.15s' }} />
            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
        ) : (
          <MessageContent content={message.content} />
        )}

        {/* Token data info (assistant only) */}
        {!isUser && message.tokenData && (
          <div className="text-xs mt-3 pt-2 border-t border-white/10 text-white/80 space-y-1">
            {message.tokenData.price ? (
              <p>
                <span className="font-semibold">Price:</span> ${message.tokenData.price.toFixed(6)}
              </p>
            ) : null}
            {message.tokenData.marketCap ? (
              <p>
                <span className="font-semibold">Market Cap:</span> ${(message.tokenData.marketCap / 1e6).toFixed(1)}M
              </p>
            ) : null}
            {message.tokenData.volume24h ? (
              <p>
                <span className="font-semibold">24h Vol:</span> ${(message.tokenData.volume24h / 1e6).toFixed(1)}M
              </p>
            ) : null}
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-white/60'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}
