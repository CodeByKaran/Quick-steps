import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContentCardProps {
  snippetId: number;
  snippetTitle: string;
  snippetDescription: string;
  markdown?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

export function ContentCard({
  snippetId,
  snippetTitle,
  snippetDescription,
  tags,
  createdAt,
  updatedAt,
}: ContentCardProps) {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const Arraytags = tags ? tags.split(",") : [];

  const handleRouteForward = () => {
    console.log("Routing to snippet:", snippetId);

    router.push(`/${snippetId}`, {});
    console.log("Routed to snippet:", snippetId);
  };

  return (
    <Card
      className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 max-w-md mx-auto cursor-pointer"
      onClick={handleRouteForward}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.01] pointer-events-none sm:block hidden" />

      <CardHeader className="relative ">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-xl text-primary leading-tight text-balance group-hover:text-primary/90 transition-colors font-poppins">
            {snippetTitle}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <p className="text-card-foreground/80 leading-relaxed text-pretty font-poppins text-sm">
          {snippetDescription}
        </p>

        {Arraytags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Arraytags?.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-muted/70 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-xs font-poppins"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-mono">{formatDate(createdAt)}</span>
            </div>
            {createdAt !== updatedAt && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono">{formatDate(updatedAt)}</span>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            {formatTime(createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
