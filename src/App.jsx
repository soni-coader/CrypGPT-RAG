import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { useTokenData } from './hooks/useTokenData';
import { useChat } from './hooks/useChat';

/**
 * Main App Component
 * Orchestrates sidebar and chat area, manages state and API communication
 */
export function App() {
  const { tokenData, error: tokenError, refresh: refreshTokenData } = useTokenData();
  const {
    messages,
    loading,
    error,
    sendMessage,
    setError
  } = useChat();

  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (query) => {
    setSidebarOpen(false);
    await sendMessage(query);
  };

  // Handle quick question click
  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  // Close sidebar on mobile navigation
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#202123] overflow-hidden min-w-0">
      {/* Sidebar - fixed on all viewports */}
      <Sidebar
        tokenData={tokenData}
        tokenError={tokenError}
        onRefreshTokenData={refreshTokenData}
        onSelectQuestion={handleQuickQuestion}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Chat Area - margin-left so content doesn't sit under fixed sidebar on desktop */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 md:ml-72">
        <ChatArea
        messages={messages}
        loading={loading}
        error={error}
        input={input}
        setInput={setInput}
        onSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        tokenData={tokenData}
        onClearError={() => setError(null)}
      />
      </div>
    </div>
  );
}
