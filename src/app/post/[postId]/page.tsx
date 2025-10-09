import Link from "next/link";
import { notFound } from "next/navigation";
import z from "zod";
import { AnswerList } from "~/components/shared/AnswerList";
import { AvatarComponent } from "~/components/shared/AvatarComponent";
import { CreateAnswerCard } from "~/components/shared/CreateAnswerCard";
import { PostDetailCard } from "~/components/shared/PostDetailCard";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";

const answerFormSchema = z.object({
  body: z.string(),
});

export default async function PostDetail({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  try {
    const postDetail = await api.post.getPostById({ postId });

    return (
      <div className="space-y-6 p-2">
        <PostDetailCard
          postId={postId}
          author={{
            name: postDetail?.author.name ?? "",
            username: postDetail?.author.username ?? "",
            image: postDetail?.author.image ?? "",
          }}
          title={postDetail?.title ?? ""}
          description={postDetail?.description ?? ""}
          createdAt={postDetail?.createdAt ?? new Date()}
          isAnswered={Boolean(postDetail?.answeredAt)}
        />

        <CreateAnswerCard postId={postId} />

        <AnswerList postId={postId} />
      </div>
    );
  } catch (err: any) {
    console.log(err.code);
    err.code === "NOT_FOUND" && notFound();
    // throw new Error(err.message || "Something went wrong");
    throw err;
  }
}
