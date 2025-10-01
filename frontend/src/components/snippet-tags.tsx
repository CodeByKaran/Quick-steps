"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface SnippetTagsProps {
  tags: string;
}

export function SnippetTags({ tags }: SnippetTagsProps) {
  const tagList = tags
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {tagList?.map((tag, index) => (
        <motion.div
          key={tag}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.4 + index * 0.1 }}
        >
          <Badge
            variant="secondary"
            className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors"
          >
            {tag}
          </Badge>
        </motion.div>
      ))}
    </motion.div>
  );
}
