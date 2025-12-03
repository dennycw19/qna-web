import { EllipsisVerticalIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/trpc/react";
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
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AvatarComponent } from "./AvatarComponent";

type AnswerCardProps = {
  id: string;
  name: string;
  username: string;
  createdDate: Date;
  userImage: string;
  body: string;
};

export const AnswerCard = (props: AnswerCardProps) => {
  const apiUtils = api.useUtils();
  const router = useRouter();
  const { data: session } = useSession();
  const getAnswerByIdQuery = api.answer.getAnswerById.useQuery({
    answerId: props.id,
  });
  const deleteAnswerMutation = api.answer.deleteAnswer.useMutation();

  const handleDeleteAnswer = () => {
    toast.promise(
      deleteAnswerMutation.mutateAsync(
        { answerId: props.id },
        {
          onSuccess: () => {
            void apiUtils.answer.getAnswerPaginated.invalidate();
            // router.push("/");
          },
        },
      ),
      {
        loading: "Deleting answer...",
        success: "Answer deleted successfully!",
        error: "Failed to delete answer.",
      },
    );
  };
  return (
    <div className="space-y-4 rounded-xl border p-6 shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div>
            <AvatarComponent name={props.name} image={props.userImage} />
          </div>
          <div className="space-y-0.5">
            <p className="font-medium">{props.username}</p>
            <p className="text-muted-foreground text-sm">
              {props.createdDate.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getAnswerByIdQuery.data?.author.email === session?.user.email && (
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
                    <AlertDialogTrigger
                      disabled={deleteAnswerMutation.isPending}
                    >
                      Delete Answer
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this answer?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your answer and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAnswer}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <p>{props.body}</p>
      </div>
    </div>
  );
};
