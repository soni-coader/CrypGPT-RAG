/**
 * Quick questions sidebar component
 * Shows preset questions users can click to ask
 */
export function QuickQuestions({ onSelectQuestion }) {
  const questions = [
    'What is Cryptora?',
    'What are Cryptora tokenomics?',
    'What is the Cryptora roadmap?',
    'What are Cryptora use cases?',
    'How does the Cryptora ecosystem work?',
    'What is the Cryptora token used for?'
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="text-xs text-white/60 mb-3 font-semibold uppercase tracking-wide">
        Quick Questions (Cryptora)
      </p>
      <div className="space-y-1">
        {questions.map((question) => (
          <button
            key={question}
            onClick={() => onSelectQuestion(question)}
            className="w-full text-left text-sm p-3 rounded-curve hover:bg-[#343541] text-white/80 hover:text-white transition font-medium"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
