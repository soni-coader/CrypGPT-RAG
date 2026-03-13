import { MessageBubble } from './MessageBubble';
import { ErrorAlert } from './ErrorAlert';
import logo from '../assets/logo/logo 1.png';

/**
 * Messages container component
 * Displays all chat messages, loading state, and errors
 */
export function MessagesContainer({ messages, loading, error, messagesEndRef, onClearError }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-dark">
      <div className="min-h-full flex justify-center p-4 md:p-6">
        <div className="w-full max-w-[50rem] space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center px-4 min-h-[200px]">
              {error ? (
                <ErrorAlert message={error} onRetry={onClearError} />
              ) : (
                <div className="text-center max-w-sm">
                  <div className="w-14 md:w-16 h-14 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden bg-[#303030]">
                    <img
                      src={logo}
                      alt="CrypGPT"
                      className="w-10 h-10 md:w-12 md:h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                    Welcome to CrypGPT
                  </h3>
                  <p className="text-sm md:text-base text-white/60">
                    Ask me about CrypGPT tokenomics, roadmap, use cases, or anything else!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} loading={loading} />
              ))}
              {loading && (messages.length === 0 || messages[messages.length - 1]?.type === 'user') && (
                <div className="flex justify-start px-2 md:px-4">
                  <div className="w-full max-w-full py-2 text-sm text-white">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <p className="text-xs mt-2 text-white/60">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )}
              {error && <ErrorAlert message={error} onRetry={onClearError} />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
