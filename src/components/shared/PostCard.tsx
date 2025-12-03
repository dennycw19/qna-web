import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { MessageSquareMore } from "lucide-react";
import { AvatarComponent } from "./AvatarComponent";

type PostCardProps = {
  id: string;
  userImage: string;
  name: string;
  username: string;
  createdDate: Date;
  isAnswered: boolean;
  title: string;
  description: string;
  totalComments: number;
  // status: "ANSWERED" | "UNANSWERED";
};

export const PostCard = (props: PostCardProps) => {
  const postDetailURL = "/post/" + props.id;

  return (
    <div className="space-y-4 rounded-xl border p-6 shadow">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Link href={"/profile/" + props.username}>
            <AvatarComponent image={props.userImage} name={props.name} />
          </Link>
          <div className="space-y-0.5">
            <Link href={"/profile/" + props.username}>
              <p className="font-medium">{props.username}</p>
            </Link>
            <p className="text-muted-foreground text-sm">
              {props.createdDate.toLocaleDateString()}
            </p>
          </div>
        </div>
        {!props.isAnswered ? (
          <Badge variant="secondary" className="h-fit">
            Unanswered
          </Badge>
        ) : (
          <Badge variant="default" className="h-fit">
            Answered
          </Badge>
        )}
      </div>

      {/* Content */}
      <Link href={postDetailURL} className="group">
        <div className="space-y-1">
          <h3 className="group-hover:text-primary text-lg font-semibold">
            {props.title}
          </h3>
          <p>{props.description}</p>
        </div>
      </Link>

      {/* Footer */}
      <div className="mt-4 flex justify-between border-t pt-3">
        <Link
          href={postDetailURL}
          className="text-muted-foreground flex items-center gap-1 text-sm"
        >
          {" "}
          <MessageSquareMore className="size-4" /> {props.totalComments} answers
        </Link>

        <Link href={postDetailURL} className="text-primary text-sm">
          View Post
        </Link>
      </div>
    </div>
  );
};
