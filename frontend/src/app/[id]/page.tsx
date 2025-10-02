"use client";

import { getSnippet } from "@/functions/snippetsFunction";
import { useQuery } from "@tanstack/react-query";
import useLogger from "@/hooks/useLogger";
import { use, useState } from "react";
import { ScrollProgress } from "@/components/scroll-progress";
import { SnippetHeader } from "@/components/snippet-header";
import { motion } from "framer-motion";
import MarkDownViewer from "@/components/markdow-viewer";
import { Loader, MessageCircleMore, ThumbsUp } from "lucide-react";
import CommentsList from "@/components/comments-list";
import CommentHeader from "@/components/comment-header";
import PostCommentBox from "@/components/post-comment-box";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SnippetPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: ["snippet", id],
    queryFn: () => getSnippet(id),
    staleTime: 60 * 10 * 1000,
    enabled: id !== undefined,
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  useLogger(`${data?.data?.data.snippet}`);

  if (isLoading) {
    return (
      <div className="h-screen bg-background w-screen flex justify-center items-center">
        <Loader
          size={36}
          className="animate-spin dark:text-accent/50 text-primary"
        />
      </div>
    );
  }

  const snippet = data?.data?.data?.snippet;

  if (!snippet) {
    return (
      <div className="min-h-screen bg-background">
        <ScrollProgress />
        <div className="container mx-auto px-4 py-12">
          <motion.div
            className="flex items-center justify-center min-h-[60vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-foreground">
                Snippet not found
              </h1>
              <p className="text-muted-foreground">
                The snippet you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen ">
      <div className="flex justify-between ">
        <div className="min-[1000px]:flex-[0.7] flex-1   no-scrollbar overflow-auto h-screen sticky top-0 left-0 px-6">
          <motion.div
            className="container mx-auto  py-12 max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <SnippetHeader
              title={snippet.title}
              description={snippet.description}
              tags={snippet.tags}
              createdAt={snippet.createdAt}
              user={snippet.user}
            />
            <div className="flex gap-4  mb-6">
              <Button
                variant={"destructive"}
                className="flex  text-xs font-poppins   items-center gap-2 bg-red-400 dark:bg-red-500"
              >
                112k
                <ThumbsUp className="text-white" />
              </Button>
              <Button
                variant={"default"}
                className="max-[1000px]:flex hidden text-xs font-poppins   items-center gap-2 dark:bg-blue-600 dark:text-foreground"
                onClick={() => setIsOpen(!isOpen)}
              >
                20k
                <MessageCircleMore className="text-white" />
              </Button>
            </div>

            <MarkDownViewer md={snippet.markdown} />
          </motion.div>
        </div>
        <div
          className={cn(
            " min-w-[290px] h-screen overflow-auto right-0 top-0 p-3 ",
            !isOpen
              ? "sticky hidden min-[1000px]:block flex-[0.290]"
              : "fixed  w-screen max-[350px]:w-full bg-background/45 backdrop-blur-lg flex justify-end"
          )}
        >
          <div
            className={cn(
              "h-full w-full overflow-auto rounded-xl no-scrollbar border border-border bg-background",
              isOpen && "max-w-[350px] "
            )}
          >
            <CommentHeader handleClose={handleClose} />
            <CommentsList snippetId={id} />
            <PostCommentBox id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
