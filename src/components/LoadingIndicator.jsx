/**
 * Loading indicator component
 * Shows animated loading state while waiting for bot response
 */
export function LoadingIndicator() {
  return (
    <div className="flex justify-start px-2">
      <div className="bg-[#303030] px-4 py-3 rounded-curve rounded-bl-[6px]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}
