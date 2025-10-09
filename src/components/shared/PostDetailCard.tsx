"use client";
import Link from "next/link";
import { AvatarComponent } from "./AvatarComponent";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import { notFound, useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type PostDetailCardProps = {
  postId: string;
  title: string;
  description: string;
  createdAt: Date;
  isAnswered: boolean;
  author: {
    username: string;
    name: string;
    image: string;
  };
};

export const PostDetailCard = (props: PostDetailCardProps) => {
  const apiUtils = api.useUtils();
  const router = useRouter();

  const { data: session } = useSession();

  const getPostByIdQuery = api.post.getPostById.useQuery({
    postId: props.postId,
  });

  const markAsAnsweredMutation = api.post.markAsAnswered.useMutation({
    onSuccess: async () => {
      {
        !props.isAnswered
          ? toast.success("Mark as Answered!")
          : toast.success("Mark as Unanswered!");
      }
      await apiUtils.post.getPostById.invalidate({ postId: props.postId });
      await apiUtils.post.getPostPaginated.invalidate({});
    },
  });

  const handleMarkAsAnswered = () => {
    markAsAnsweredMutation.mutate({ postId: props.postId, answered: true });
  };
  const handleMarkAsUnanswered = () => {
    markAsAnsweredMutation.mutate({ postId: props.postId, answered: false });
  };

  // const deletePostMutation = api.post.deletePost.useMutation({
  //   onSuccess: async () => {
  //     toast.success("Post Deleted!");

  //     await apiUtils.post.getPostPaginated.invalidate({});
  //     router.push("/");
  //   },
  // });
  // const handleDeletePost = () => {
  //   deletePostMutation.mutate({ postId: props.postId });
  // };
  const deletePostMutation = api.post.deletePost.useMutation();

  const handleDeletePost = () => {
    toast.promise(
      deletePostMutation.mutateAsync(
        { postId: props.postId },
        {
          onSuccess: async () => {
            await apiUtils.post.getPostPaginated.invalidate();
            router.push("/"); // balik ke home
          },
        },
      ),
      {
        loading: "Deleting post...",
        success: "Post deleted successfully!",
        error: "Failed to delete post.",
      },
    );
  };
  return (
    // Post Detail Card
    <div className="space-y-4 rounded-xl border p-6 shadow">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Link href={"/profile/" + props.author.username}>
            <AvatarComponent
              image={props.author.image}
              name={props.author.name}
            />
          </Link>
          <div className="space-y-0.5">
            <Link href={"/profile/" + props.author.username}>
              <p className="font-medium">{props.author.username}</p>
            </Link>
            <p className="text-muted-foreground text-sm">
              {props.createdAt.toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getPostByIdQuery.isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : getPostByIdQuery.data?.answeredAt ? (
            <Badge variant="default" className="h-fit">
              Answered
            </Badge>
          ) : (
            <Badge variant="secondary" className="h-fit">
              Unanswered
            </Badge>
          )}
          
          {getPostByIdQuery.data?.author.email == session?.user.email && (
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"secondary"} className="h-8 w-2">
                    <EllipsisVerticalIcon className="text-muted-foreground hover:text-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* <DropdownMenuItem onClick={handleDeletePost} disabled={deletePostMutation.isPending}>
                Delete Post
              </DropdownMenuItem> */}
                  <DropdownMenuItem>
                    <AlertDialogTrigger disabled={deletePostMutation.isPending}>
                      Delete Post
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this post?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your post and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePost}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{props.title}</h1>
        <p>{props.description}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t pt-4">
        {getPostByIdQuery.data?.author.email == session?.user.email && (
          <>
            {getPostByIdQuery.isLoading ? (
              <Skeleton className="h-10 w-40" />
            ) : !getPostByIdQuery.data?.answeredAt ? (
              <Button
                disabled={markAsAnsweredMutation.isPending}
                onClick={handleMarkAsAnswered}
                variant="default"
              >
                {markAsAnsweredMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    Marking as Answered...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Mark as Answered
                  </span>
                )}
                {/* Mark as Answered */}
              </Button>
            ) : (
              <Button
                disabled={markAsAnsweredMutation.isPending}
                onClick={handleMarkAsUnanswered}
                variant="secondary"
              >
                {markAsAnsweredMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    Marking as Unanswered...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Mark as Unanswered
                  </span>
                )}
                {/* Mark as Unanswered */}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
