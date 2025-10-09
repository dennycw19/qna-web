import { Frown } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-2 text-center">
      <Frown className="size-15" />
      <h1 className="text-primary text-9xl font-bold">404</h1>
      <h2 className="text-secondary text-5xl font-bold">Not Found</h2>
      <p className="text-muted-foreground">
        Sorry, the profile you are looking for does not exist.
      </p>
      <Link href={"/"}>
        <Button>Go Home</Button>
      </Link>
      {/* <a href="/" className="rounded-lg px-4 py-2 text-white shadow transition">
        Go Home
      </a> */}
    </div>
  );
}
