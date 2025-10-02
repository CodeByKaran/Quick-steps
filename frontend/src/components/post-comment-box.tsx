import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "@/functions/snippetsFunction";
import { AxiosError } from "axios";
import { Cross, X } from "lucide-react";

interface PostCommentBoxProps {
  id: number;
}

// Type for your backend error response
interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

const PostCommentBox = (props: PostCommentBoxProps) => {
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => {
      const commentText = commentRef.current?.value?.trim();
      if (!commentText) {
        throw new Error("Please enter a comment");
      }
      return postComment(props.id, commentText);
    },
    onSuccess: () => {
      // Clear the textarea and error message
      if (commentRef.current) {
        commentRef.current.value = "";
      }
      setErrorMessage("");

      // Invalidate and refetch comments
      queryClient.invalidateQueries({
        queryKey: ["snippetscomments", props.id],
      });
    },
    onError: (error: unknown) => {
      let errorMessage = "Something went wrong. Please try again.";

      if (error instanceof AxiosError) {
        console.log(`error response data: ${JSON.stringify(error.response)}`);

        if (error.response?.status === 401) {
          errorMessage = "Please sign in to post a comment";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setErrorMessage(errorMessage);
    },
  });

  const handleSubmit = () => {
    setErrorMessage(""); // Clear previous errors
    mutate();
  };

  return (
    <div className="p-4 flex flex-col gap-y-2 bg-background sticky bottom-0 left-0  max-h-fit">
      {/* Error Message Display */}
      {errorMessage && (
        <div className="flex justify-between items-center px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400 font-poppins">
            {errorMessage}
          </p>
          <X
            size={16}
            onClick={() => setErrorMessage("")}
            className="text-red-500"
          />
        </div>
      )}

      <div className="flex gap-x-2 items-center">
        <div className="w-full">
          <textarea
            ref={commentRef}
            placeholder="any comments you'd like .."
            className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-16 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none font-poppins focus-within:ring-offset-1 dark:ring-offset-0 focus-within:ring-2 focus-within:ring-primary "
            disabled={isPending}
          />
        </div>
        <div className="flex-[0.3]">
          <Button
            variant={"default"}
            className="font-poppins font-medium text-sm"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCommentBox;
