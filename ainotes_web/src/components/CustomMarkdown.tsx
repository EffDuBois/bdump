import Markdown, {
  Options,
} from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CustomMarkdown({ remarkPlugins, ...props }: Options) {
  return (
    <Markdown
      {...props}
      remarkPlugins={[remarkGfm, ...(remarkPlugins || [])]}
      components={{
        code(props) {
          return (
            <pre style={{ whiteSpace: "pre-wrap" }}>
              <code {...props} />
            </pre>
          );
        },
      }}
    />
  );
}
