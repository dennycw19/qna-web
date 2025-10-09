"use client";

import { api } from "~/trpc/react";
import { AnswerCard } from "./AnswerCard";
import { Button } from "../ui/button";
import { useEffect } from "react";

type AnswerListProps = {
  postId: string;
};
export const AnswerList = (props: AnswerListProps) => {
  const apiUtils = api.useUtils();
  const getAnswersQuery = api.answer.getAnswersByPostId.useQuery({
    postId: props.postId,
  });

  const paginatedAnswersQuery = api.answer.getAnswerPaginated.useInfiniteQuery(
    {
      limit: 2,
      postId: props.postId,
    },
    {
      getNextPageParam: ({ nextCursor, answers }) => {
        return nextCursor;
      },
    },
  );

  const handleFetchNextPage = async () => {
    await paginatedAnswersQuery.fetchNextPage();
    await apiUtils.answer.getAnswerPaginated.invalidate();
  };


  return (
    <div className="flex flex-col justify-center space-y-2">
      {paginatedAnswersQuery.data?.pages
        .flatMap((page) => page.answers)
        .map((answer) => {
          return (
            <AnswerCard
              id={answer.id}
              body={answer.body}
              createdDate={answer.createdAt}
              userImage={answer.author.image ?? ""}
              username={answer.author.username ?? ""}
              name={answer.author.name ?? ""}
              key={answer.id}
            />
          );
        })}

      {paginatedAnswersQuery.hasNextPage && (
        <Button
          disabled={paginatedAnswersQuery.isFetching}
          className="self-center"
          onClick={handleFetchNextPage}
        >
          {paginatedAnswersQuery.isFetching ? "Loading..." : "See More"}
        </Button>
      )}
      {/* {getAnswersQuery.data?.map((answer) => {
        return (
          <AnswerCard
            id={answer.id}
            body={answer.body}
            createdDate={answer.createdAt}
            userImage={answer.author.image ?? ""}
            username={answer.author.username ?? ""}
            name={answer.author.name ?? ""}
            key={answer.id}
          />
        );
      })} */}
    </div>
  );
};
