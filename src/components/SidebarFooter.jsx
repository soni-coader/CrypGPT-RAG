/**
 * Sidebar footer component
 * Shows backend online status
 */
export function SidebarFooter() {
  return (
    <div className="p-4 border-t border-white/5 text-xs text-white/60 bg-[#181818] rounded-t-curve">
      <p className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-medium text-white/80">Backend Status</span>
      </p>
      <p className="text-white/60 mt-1 text-xs">Online</p>
    </div>
  );
}
