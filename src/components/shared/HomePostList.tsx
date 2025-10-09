"use client";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { PostCard } from "./PostCard";

export const HomePostList = () => {
  const postQuery = api.post.getAllPosts.useQuery();

  const paginatedPostQuery = api.post.getPostPaginated.useInfiniteQuery(
    {
      limit: 2,
    },
    {
      getNextPageParam: ({ nextCursor, posts }) => {
        return nextCursor;
      },
    },
  );

  const handleFetchNextPage = async () => {
    await paginatedPostQuery.fetchNextPage();
  };
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Recent Questions</h2>
      {/* List of posts */}
      <div className="flex flex-col justify-center space-y-4">
        {paginatedPostQuery.data?.pages
          .flatMap((page) => page.posts)
          .map((post) => {
            return (
              <PostCard
                key={post.id}
                id={post.id}
                createdDate={post.createdAt}
                name={post.author.name!}
                username={post.author.username!}
                userImage={post.author.image ?? ""}
                title={post.title}
                description={post.description}
                isAnswered={Boolean(post.answeredAt)}
                totalComments={post.answers.length}
              />
            );
          })}

        {paginatedPostQuery.hasNextPage && (
          <Button
            disabled={paginatedPostQuery.isFetching}
            className="self-center"
            onClick={handleFetchNextPage}
          >
            {paginatedPostQuery.isFetching ? "Loading..." : "See More"}
          </Button>
        )}

        {/* {postQuery.data?.map((post) => {
          return (
            <PostCard
              key={post.id}
              id={post.id}
              createdDate={post.createdAt}
              name={post.author.name!}
              username={post.author.username!}
              userImage={post.author.image ?? ""}
              title={post.title}
              description={post.description}
              status="UNANSWERED"
              totalComments={0}
            />
          );
        })} */}
        {/* <PostCard
          createdDate={new Date()}
          id="123"
          description="Ini descriptionnya"
          name="Denny Cahyo W"
          status="UNANSWERED"
          title="Ini Title"
          totalComments={0}
          userImage=""
          username="dennycw19"
        />
        <PostCard
          createdDate={new Date()}
          id="123"
          description="Ini descriptionnya"
          name="Denny Cahyo W"
          status="ANSWERED"
          title="Ini Title"
          totalComments={0}
          userImage=""
          username="dennycw19"
        /> */}
      </div>
    </div>
  );
};
