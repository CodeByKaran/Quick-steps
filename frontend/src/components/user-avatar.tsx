"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface UserAvatarProps {
  avatar: string | null;
  username: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ avatar, username, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const fallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=0f172a&textColor=ffffff`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Avatar className={`${sizeClasses[size]} ring-2 ring-primary/20`}>
        <AvatarImage src={avatar || fallbackUrl} alt={username} />
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          {username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
}
