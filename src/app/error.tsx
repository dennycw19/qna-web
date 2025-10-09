"use client";

import { FrownIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.log(error.message);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center space-y-4 text-center">
      <FrownIcon className="text-muted-foreground size-15" />
      <h1 className="text-5xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Link href={"/"}>
        <Button>Go Home</Button>
      </Link>
      {/* <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button> */}
    </main>
  );
}
