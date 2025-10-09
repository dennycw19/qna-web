import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [GoogleProvider],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    signIn: async ({ user, isNewUser }) => {
      if (!isNewUser) return;
      // dennycw19@gmail.com
      // ["dennycw19", "gmail.com"]
      const generatedUsername = user.email?.split("@")[0];

      await db.user.update({
        where: {
          email: user.email!,
        },
        data: {
          username: generatedUsername,
        },
      });
    },
    // createUser: async ({ user }) => {
    //   // dennycw19@gmail.com
    //   // ["dennycw19", "gmail.com"]
    //   const generatedUsername = user.email?.split("@")[0];

    //   await db.user.update({
    //     where: {
    //       email: user.email!,
    //     },
    //     data: {
    //       username: generatedUsername,
    //     },
    //   });
    // },
  },
} satisfies NextAuthConfig;
