import { ChatHeader } from './ChatHeader';
import { MessagesContainer } from './MessagesContainer';
import { ChatInput } from './ChatInput';

/**
 * Main chat area component
 * Contains header, messages, input, and loading/error states
 */
export function ChatArea({
  messages,
  loading,
  error,
  input,
  setInput,
  onSendMessage,
  messagesEndRef,
  onMenuClick,
  tokenData,
  onClearError
}) {
  return (
    <div className="flex-1 flex flex-col min-h-screen md:h-screen bg-[#202123] overflow-hidden min-w-0">
      <ChatHeader onMenuClick={onMenuClick} tokenData={tokenData} />
      <MessagesContainer
        messages={messages}
        loading={loading}
        error={error}
        messagesEndRef={messagesEndRef}
        onClearError={onClearError}
      />
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={onSendMessage}
        disabled={loading}
      />
    </div>
  );
}
