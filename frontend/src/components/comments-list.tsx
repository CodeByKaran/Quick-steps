"use client";
import React, { useEffect } from "react";
import CommentBox from "./comment-box";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSnipetComments } from "@/functions/snippetsFunction";
import { useInView } from "react-intersection-observer";
import { Loader } from "lucide-react";

interface CommentsListProps {
  snippetId: number;
}

interface Comment {
  id: number;
  comment: string;
  username: string;
  userAvatar: string;
}

const CommentsList = (props: CommentsListProps) => {
  const { data, isLoading, error, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["snippetscomments", props.snippetId],
      queryFn: ({ pageParam: cursor }) =>
        cursor
          ? fetchSnipetComments(props.snippetId, cursor)
          : fetchSnipetComments(props.snippetId),
      getNextPageParam: (lastPage) => lastPage?.data?.data?.nextCursor,
      initialPageParam: { cursorId: 0 },
      staleTime: 60000,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size={36} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!data || data.pages[0].data.data.comments.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground p-4 text-center">
        No comments yet. Be the first to comment! 🔕
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col  gap-y-4">
        {data?.pages.map((page) =>
          page.data.data.comments.map((item: Comment) => (
            <CommentBox key={item.id} {...item} />
          ))
        )}
      </div>
      <div
        className={`flex items-center justify-center mt-4 ${
          hasNextPage ? "flex" : "hidden"
        }`}
        ref={ref}
      >
        <Loader
          size={36}
          className="animate-spin dark:text-accent/50 text-primary"
        />
      </div>
    </div>
  );
};

export default CommentsList;
