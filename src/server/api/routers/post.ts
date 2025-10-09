import { TRPCError } from "@trpc/server";
import { title } from "process";
import { boolean, string, z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { title, description } = input;

      const newPost = await db.post.create({
        data: {
          title: input.title,
          description: input.description,

          userId: session.user.id,
        },
      });
      return newPost;
    }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { postId } = input;

      const delPost = await db.post.delete({
        where: {
          id: postId,
        },
      });
      return delPost;
    }),

  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        author: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
        createdAt: true,
        answeredAt: true,
      },
    });
    return posts;
  }),

  getPostById: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { postId } = input;

      const postDetail = await db.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          title: true,
          description: true,
          createdAt: true,
          answeredAt: true,
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      });
      if (!postDetail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `post with id '${postId}' not exist`,
        });
      }
      return postDetail;
    }),

  getPostPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(2),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      // cursor = postId
      const { limit, cursor } = input;

      // limit = 2
      // take = 3
      const posts = await db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          answeredAt: true,
          author: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
          createdAt: true,
          answers: {
            select: {
              body: true,
            },
          },
        },
      });

      // kirim cursor berikutnya ke frontend
      let nextCursor: string | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop(); // remove and return last item of array
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  markAsAnswered: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        answered: boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const answeredAtPost = await db.post.update({
        where: {
          id: input.postId,
          userId: session.user.id,
        },
        data: {
          answeredAt: input.answered ? new Date() : null,
        },
      });
      return answeredAtPost;
    }),
});
