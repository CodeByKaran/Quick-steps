"use client";

import { getSnippet } from "@/functions/snippetsFunction";
import { useQuery } from "@tanstack/react-query";
import useLogger from "@/hooks/useLogger";
import { use } from "react";
import { ScrollProgress } from "@/components/scroll-progress";
import { SnippetHeader } from "@/components/snippet-header";
import { motion } from "framer-motion";
import MarkDownViewer from "@/components/markdow-viewer";
import { Loader } from "lucide-react";
import CommentBox from "@/components/comment-box";
import CommentsList from "@/components/comments-list";
import CommentHeader from "@/components/comment-header";
import PostCommentBox from "@/components/post-comment-box";

export default function SnippetPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: ["snippet", id],
    queryFn: () => getSnippet(id),
    staleTime: 60 * 10 * 1000,
    enabled: id !== undefined,
  });

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
                The snippet you're looking for doesn't exist.
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
        <div className="min-[1000px]:flex-[0.7] flex-1   no-scrollbar overflow-auto h-screen sticky top-0 left-0  pl-10">
          <motion.div
            className="container mx-auto px-4 py-12 max-w-4xl"
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

            <MarkDownViewer md={snippet.markdown} />
          </motion.div>
        </div>
        <div className="flex-[0.290] min-w-[290px] border  rounded-xl border-border sticky h-screen overflow-auto right-2 top-2 no-scrollbar hidden min-[1000px]:block">
          <CommentHeader />
          <CommentsList snippetId={id} />
          <PostCommentBox id={id} />
        </div>
      </div>
    </div>
  );
}
