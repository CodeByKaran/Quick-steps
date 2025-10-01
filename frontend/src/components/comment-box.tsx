import React from "react";
import { UserAvatar } from "./user-avatar";

interface CommentBoxProps {
  comment: string;
  username: string;
  userAvatar: string;
}

const CommentBox = (props: CommentBoxProps) => {
  return (
    <div className="bg-background p-2 rounded-lg border border-border">
      <div className="flex flex-col gap-y-2">
        <div className="flex justify-start items-center gap-x-3">
          <UserAvatar
            avatar={props?.userAvatar}
            username={props.username}
            size="sm"
          />
          <p className="font-poppins font-semibold text-base">
            {props.username}
          </p>
        </div>
        <div className="">
          <p className="text-sm font-normal font-sans">{props.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
