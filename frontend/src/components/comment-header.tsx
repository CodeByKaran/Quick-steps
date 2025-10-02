import { X } from "lucide-react";
import React from "react";

const CommentHeader = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <div className="flex items-center justify-between sticky top-0 left-0 bg-background z-10 p-4 ">
      <h2 className="font-poppins font-semibold text-xl   ">Comments</h2>
      <div onClick={handleClose} className="cursor-pointer min-[1000px]:hidden">
        <X
          size={24}
          className="text-red-300 hover:text-red-400 transition-colors duration-300 ease-linear"
        />
      </div>
    </div>
  );
};

export default CommentHeader;
