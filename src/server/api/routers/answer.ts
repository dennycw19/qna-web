import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { id } from "zod/v4/locales";

export const answerRouter = createTRPCRouter({
  createAnswer: protectedProcedure
    .input(
      z.object({
        body: z.string().max(1000),
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const newAnswer = await db.answer.create({
        data: {
          body: input.body,
          userId: session.user.id,
          postId: input.postId,
        },
      });
      return newAnswer;
    }),

  deleteAnswer: protectedProcedure
    .input(z.object({ answerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { answerId } = input;

      const delAnswer = await db.answer.delete({
        where: {
          id: answerId,
        },
      });
      return delAnswer;
    }),

  getAnswerById: publicProcedure
    .input(z.object({ answerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { answerId } = input;

      const answerDetail = await db.answer.findUnique({
        where: {
          id: answerId,
        },
        select: {
          id: true,
          userId: true,
          postId: true,
          body: true,
          question: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              username: true,
              email: true,
              name: true,
            },
          },
        },
      });
      return answerDetail;
    }),

  getAnswersByPostId: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const answers = await db.answer.findMany({
        where: {
          postId: input.postId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          author: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });
      return answers;
    }),

  getAnswerPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(2),
        cursor: z.string().optional(),
        postId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const { limit, cursor } = input;

      const answers = await db.answer.findMany({
        where: { postId: input.postId },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          author: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (answers.length > limit) {
        const nextItem = answers.pop();
        nextCursor = nextItem?.id;
      }

      return {
        answers,
        nextCursor,
      };
    }),
});
