import { PageNotFoundError } from "next/dist/shared/lib/utils";
import { notFound } from "next/navigation";
import { AvatarComponent } from "~/components/shared/AvatarComponent";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: inputUsername } = await params;

  try {
    const profile = await api.user.getProfileByUsername({
      username: inputUsername,
    });

    return (
      <main>
        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <AvatarComponent
                image={profile.image ?? ""}
                name={profile.name ?? ""}
              />

              <div className="flex flex-col gap-0.5">
                <p className="font-bold">{profile.name}</p>
                <p>@{profile.username}</p>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }

    if (typeof err === "object" && err !== null && "code" in err) {
      const e = err as { code?: string };
      if (e.code === "NOT_FOUND") {
        notFound();
      }
    }

    throw err;
  }
}
