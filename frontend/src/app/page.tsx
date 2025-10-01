"use client";
import { ContentCard } from "@/components/snippetCards";
import { fetchFeedSnipets } from "@/functions/snippetsFunction";
import useLogger from "@/hooks/useLogger";
import { sampleData } from "@/lib/data";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface cursorType {
  cursorId: number;
  cursorKey: string;
}

export default function Home() {
  const {
    data,
    isLoading,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["randomsnippets"],
    queryFn: ({ pageParam: cursor }) =>
      cursor ? fetchFeedSnipets(cursor) : fetchFeedSnipets(),
    getNextPageParam: (lastPage) => lastPage?.data?.data?.nextCursor,
    initialPageParam: { cursorId: 0, cursorKey: "" },
    staleTime: 60000,
  });

  const { ref, inView } = useInView();

  useLogger(`use inview ref: ${ref} inviw: ${inView}`, [
    ref,
    hasNextPage,
    inView,
  ]);

  useLogger(`hasnextpage:${hasNextPage}`, [hasNextPage]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // if (isLoading) {
  //   return (
  //     <div className="w-screen h-screen fixed flex items-center justify-center">
  //       <Loader size={36} className="animate-spin text-primary" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.pages.map((page) =>
          //@ts-ignore
          page.data.data.snippets.map((item) => (
            <ContentCard key={item.snippetId} {...item} />
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
}
