import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { parseMessageContent, formatInlineText } from '../utils/messageParser';

/**
 * Renders structured message content with proper formatting
 * Handles headings, lists, paragraphs, code blocks, etc.
 */
export function MessageContent({ content }) {
  const elements = parseMessageContent(content);

  return (
    <div className="space-y-2 message-content">
      {elements.map((element, idx) => {
        switch (element.type) {
          case 'heading': {
            const headingClasses = {
              1: 'text-lg font-bold mt-3 mb-2',
              2: 'text-base font-bold mt-2 mb-2',
              3: 'text-sm font-semibold mt-1 mb-1'
            };
            return (
              <div key={idx} className={headingClasses[element.level]}>
                {element.content}
              </div>
            );
          }

          case 'paragraph':
            return (
              <p
                key={idx}
                className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{
                  __html: formatInlineText(element.content)
                }}
              />
            );

          case 'list':
            return (
              <ul key={idx} className="list-disc list-inside space-y-1 text-sm">
                {element.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="ml-2"
                    dangerouslySetInnerHTML={{
                      __html: formatInlineText(item)
                    }}
                  />
                ))}
              </ul>
            );

          case 'numberedList':
            return (
              <ol key={idx} className="list-decimal list-inside space-y-1 text-sm">
                {element.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="ml-2"
                    dangerouslySetInnerHTML={{
                      __html: formatInlineText(item)
                    }}
                  />
                ))}
              </ol>
            );

          case 'code': {
            const lang = element.language || 'text';
            return (
              <div key={idx} className="code-block-wrapper rounded-curve overflow-hidden border border-white/10">
                <SyntaxHighlighter
                  language={lang}
                  style={vscDarkPlus}
                  useInlineStyles={true}
                  customStyle={{
                    margin: 0,
                    padding: '0.75rem 1rem',
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                    background: '#1e1e1e',
                    borderRadius: 0
                  }}
                  codeTagProps={{ className: 'language-code-block', style: { fontFamily: 'ui-monospace, monospace' } }}
                  showLineNumbers={false}
                  PreTag="pre"
                >
                  {element.content || ' '}
                </SyntaxHighlighter>
              </div>
            );
          }

          case 'spacer':
            return <div key={idx} className="h-2" />;

          default:
            return null;
        }
      })}
    </div>
  );
}
