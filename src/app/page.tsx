import { CreatePostCard } from "~/components/shared/CreatePostCard";
import { HomePostList } from "~/components/shared/HomePostList";

export default async function Home() {
  return (
    <main className="space-y-8 p-2">
      <div className="space-y-1 p-2">
        <h1 className="text-4xl">
          <span className="font-light">Quest</span>
          {""}
          <span className="font-bold">Stack</span>
        </h1>
        <p className="text-muted-foreground">
          Ask questions, share knowledge, and help the community grow
        </p>
      </div>
      <CreatePostCard />
      <HomePostList />
    </main>
  );
}
