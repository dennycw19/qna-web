"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const session = useSession();
  const { setTheme, theme } = useTheme();
  const handleSignIn = async () => {
    await signIn("google");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b px-6 py-2">
      <div className="flex items-center gap-3">
        <h1>
          <Link href="/">
            <span className="text-xl">
              <span className="font-light">Quest</span>
              {""}
              <span className="font-bold">Stack</span>
            </span>
          </Link>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size={"icon"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="hidden h-[1.2rem] w-[1.2rem] dark:block" />
          <Moon className="h-[1.2rem] w-[1.2rem] dark:hidden" />
        </Button>
        {session.data?.user ? (
          <Button onClick={handleSignOut}>Sign Out</Button>
        ) : (
          <Button onClick={handleSignIn}>Sign In with Google</Button>
        )}
      </div>
    </header>
  );
};
