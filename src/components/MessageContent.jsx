import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders message content with full markdown support (ChatGPT-style).
 * Supports headings, lists, code blocks, tables, blockquotes, links, etc.
 */
export function MessageContent({ content }) {
  if (!content?.trim()) return null;

  return (
    <div className="space-y-2 message-content markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg font-bold mt-3 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold mt-2 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words mb-2 last:mb-0">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 text-sm ml-0 mb-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 text-sm ml-0 mb-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-2">{children}</li>
          ),

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-white/30 pl-3 my-2 text-white/90 italic">
              {children}
            </blockquote>
          ),

          // Code: inline and block
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && (match || !className)) {
              const lang = match ? match[1] : 'text';
              return (
                <div className="code-block-wrapper rounded overflow-hidden border border-white/10 my-2">
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
                      borderRadius: 0,
                    }}
                    codeTagProps={{
                      className: 'language-code-block',
                      style: { fontFamily: 'ui-monospace, monospace' },
                    }}
                    showLineNumbers={false}
                    PreTag="pre"
                  >
                    {codeString || ' '}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded bg-white/10 text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,

          // Tables (GFM)
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 rounded border border-white/10">
              <table className="min-w-full text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-white/10">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-white/10 last:border-0">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2">{children}</td>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => <hr className="border-white/10 my-3" />,

          // Strong / emphasis / strikethrough
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => (
            <del className="line-through opacity-80">{children}</del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
