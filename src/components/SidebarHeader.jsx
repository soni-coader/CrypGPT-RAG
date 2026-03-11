/**
 * Sidebar header component
 * Shows CrypGPT logo and branding
 */
import logo from '../assets/logo/logo.png';

export function SidebarHeader({ onClose }) {
  return (
    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#181818] rounded-b-curve">
      <div className="flex items-center gap-2 min-w-0">
        <img
          src={logo}
          alt="CrypGPT"
          className="w-32    flex-shrink-0 object-contain"
        />
        {/* <h1 className="text-lg font-bold text-white truncate">CrypGPT</h1> */}
      </div>
      <button
        onClick={onClose}
        className="md:hidden text-white/60 hover:text-white transition flex-shrink-0 p-1"
        aria-label="Close sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
