"use client";

import { motion } from "framer-motion";
import { UserAvatar } from "./user-avatar";
import { SnippetTags } from "./snippet-tags";
import { Calendar, User } from "lucide-react";

interface SnippetHeaderProps {
  title: string;
  description: string;
  tags: string;
  createdAt: string;
  user: {
    avatar: string | null;
    username: string;
  };
}

export function SnippetHeader({
  title,
  description,
  tags,
  createdAt,
  user,
}: SnippetHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      className="space-y-6 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* User Info */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <UserAvatar avatar={user.avatar} username={user.username} size="lg" />
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-sm">Created by</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {user.username}
          </h3>
        </div>
      </motion.div>

      {/* Snippet Info */}
      <div className="space-y-4">
        <motion.h1
          className="text-4xl font-bold text-foreground text-balance leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground text-pretty leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          {description}
        </motion.p>

        <motion.div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Calendar className="h-4 w-4" />
          <span>{formatDate(createdAt)}</span>
        </motion.div>

        <SnippetTags tags={tags} />
      </div>
    </motion.div>
  );
}
