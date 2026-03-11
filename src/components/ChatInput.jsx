/**
 * Chat input form component
 * Handles user input and message sending
 */
export function ChatInput({ input, setInput, onSubmit, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <div className="  border-t border-white/5 p-3 md:p-4 rounded-t-curve">
      <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 max-w-3xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message CrypGPT..."
          // disabled={disabled}
          className="flex-1 px-5 md:px-6 py-3 md:py-3.5 text-sm md:text-base rounded-full bg-[#303030] border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-5 md:px-6 py-3 md:py-3.5 bg-[#303030] text-sm md:text-base bg-accent hover:bg-accent-hover text-white font-medium rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {disabled ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
