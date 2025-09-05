// Example users look-up (replace this with real user data)
const users: { [key: number]: string } = {
  1: "Alice",
  2: "Bob",
  3: "Charlie",
  4: "Dana",
  5: "Eve",
};

type snippetTypes = {
  title: string;
  markdown: string;
  description: string;
  tags: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}[];

export default function SnippetCards({ snippets }: { snippets: snippetTypes }) {
  return (
    <div className="flex flex-col items-stretch gap-3">
      {snippets.map((snippet, idx) => (
        <div
          key={snippet.title + idx}
          className="flex flex-col border rounded-lg shadow p-4 bg-background"
        >
          <div className="flex items-center gap-3">
            {/* Avatar with fallback letter */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-foreground">
              {users[snippet.userId]?.slice(0, 1).toUpperCase() ?? "U"}
            </div>
            <span className="font-medium text-foreground">
              {users[snippet.userId] ?? "Unknown"}
            </span>
          </div>
          {/* Title and description with spacing */}
          <div className="mt-2">
            <div className="font-semibold text-lg mb-1">{snippet.title}</div>
            <div className="text-foreground text-sm">
              {snippet.description.length > 80
                ? snippet.description.slice(0, 80) + "..."
                : snippet.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
