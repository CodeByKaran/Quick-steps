import React from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Element } from "hast";

export default function MarkDownViewer({ md }: { md: string }) {
  return (
    <MarkdownPreview
      source={md}
      style={{
        padding: "0",
        margin: "0",
        boxSizing: "border-box",
        backgroundColor: "cyan !important",
      }}
      rehypeRewrite={(node, index, parent) => {
        // Check if node is an Element node and has tagName
        if (
          (node as Element).tagName &&
          parent &&
          (parent as Element).tagName &&
          /^h(1|2|3|4|5|6)/.test((parent as Element).tagName || "")
        ) {
          if (Array.isArray(parent.children)) {
            parent.children = parent.children.slice(1);
          }
        }
      }}
    />
  );
}
