import { SidebarHeader } from './SidebarHeader';
import { TokenInfo } from './TokenInfo';
import { QuickQuestions } from './QuickQuestions';
import { SidebarFooter } from './SidebarFooter';

/**
 * Sidebar component
 * Contains logo, token info, quick questions, and API status
 */
export function Sidebar({ tokenData, tokenError, onRefreshTokenData, onSelectQuestion, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative w-64 md:w-72 h-screen bg-[#181818] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ease-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarHeader onClose={onClose} />
        <TokenInfo tokenData={tokenData} tokenError={tokenError} onRefresh={onRefreshTokenData} />
        <QuickQuestions
          onSelectQuestion={(question) => {
            onSelectQuestion(question);
            onClose();
          }}
        />
        <SidebarFooter />
      </div>
    </>
  );
}
