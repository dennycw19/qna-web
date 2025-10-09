import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getProfileByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { username } = input;
      const profile = await db.user.findUnique({
        where: {
          username: username,
        },
        select: {
          image: true,
          username: true,
          email: true,
          name: true,
          id: true,
        },
      });
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `profile with username '${username}' not found`,
        });
      }
      return profile;
    }),
});
