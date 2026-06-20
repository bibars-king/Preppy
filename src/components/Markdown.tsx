import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// Renders question prompts, choices, explanations, and model answers.
// Supports GitHub-flavored markdown plus inline ($…$) and block ($$…$$) math.
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={
        "prose-preppy leading-relaxed [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-border/40 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] " +
        (className ?? "")
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
