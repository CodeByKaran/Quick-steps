import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { CornerDownRight } from "lucide-react";
import { sampleSnippetsData, users } from "@/lib/data";

const SearchDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Input
          type="search"
          readOnly
          placeholder="Search snippets..."
          className="w-[300px] max-[1000px]:w-[100%]  rounded-md bg-background border border-border placeholder-gray-400 text-primary focus:outline-none font-poppins "
          aria-label="Search snippets"
        />
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-lg   px-3 pb-5 pt-4 rounded-xl border-0 ring-[3px] ring-border shadow-2xl "
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>
            <Input
              type="search"
              placeholder="Search snippets..."
              className="rounded-md bg-background border border-border placeholder-gray-400 text-foreground f  font-poppins font-normal focus-within:ring-0 focus:ring-0"
              aria-label="Search snippets"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col justify-start px-2 overflow-hidden">
          <h3 className="text-foreground font-poppins text-xs flex mb-2">
            snippets <CornerDownRight size={13} className="ml-2 mt-1" />
          </h3>
          <div className="flex flex-col items-stretch gap-3 max-h-[350px] overflow-y-auto no-scrollbar pr-2">
            {sampleSnippetsData.map((snippet, idx) => (
              <div
                key={snippet.title + idx}
                className="flex flex-col border rounded-lg shadow p-4 bg-background"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar with fallback letter */}
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-foreground">
                    {users[snippet.userId]?.slice(0, 1).toUpperCase() ?? "U"}
                  </div>
                  <span className="font-medium text-foreground">
                    {users[snippet.userId] ?? "Unknown"}
                  </span>
                </div>
                {/* Title and description with spacing */}
                <div className="mt-2">
                  <div className="font-semibold text-lg mb-1">
                    {snippet.title}
                  </div>
                  <div className="text-foreground text-sm">
                    {snippet.description.length > 80
                      ? snippet.description.slice(0, 80) + "..."
                      : snippet.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
