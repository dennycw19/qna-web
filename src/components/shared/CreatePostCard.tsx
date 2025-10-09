"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { api } from "~/trpc/react";
import { signIn, useSession } from "next-auth/react";
import { AvatarComponent } from "./AvatarComponent";

import { Label } from "@radix-ui/react-label";
import { Loader2Icon, X } from "lucide-react";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

// Validasi
const createPostFormSchema = z.object({
  title: z.string().max(100).min(1),
  description: z.string().max(1000).min(1),
});

// Typescript type
type CreatePostFormSchema = z.infer<typeof createPostFormSchema>;

export const CreatePostCard = () => {
  const { data: session, status } = useSession();

  const form = useForm<CreatePostFormSchema>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const apiUtils = api.useUtils();
  const createPostMutation = api.post.createPost.useMutation({
    onSuccess: async () => {
      // alert("Post created!");
      toast.success("Post Created!");

      form.reset();
      // await apiUtils.post.getAllPosts.invalidate();
      await apiUtils.post.getPostPaginated.invalidate();
    },
  });

  const handleCreatePost = (values: CreatePostFormSchema) => {
    createPostMutation.mutate({
      title: values.title,
      description: values.description,
    });
  };

  const handleSignIn = async () => {
    await signIn("google");
  };

  return (
    <Form {...form}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Ask a question</CardTitle>
        </CardHeader>

        {status == "loading" ? (
          <CardContent>
            <Skeleton className="h-50 w-full" />
          </CardContent>
        ) : !!session ? (
          <CardContent>
            <div className="flex gap-4">
              <AvatarComponent
                image={session.user.image ?? ""}
                name={session.user.name ?? "User"}
              />

              {/* input section */}
              <div className="w-full space-y-1.5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Title of your question.."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Details of your question.."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="space-y-4 text-center">
              <p className="text-xl">
                You have to be signed in to ask a question
              </p>
              <Button size="lg" onClick={handleSignIn}>
                Sign In
              </Button>
            </div>
          </CardContent>
        )}

        {!!session && (
          <CardFooter className="flex justify-end">
            <Button
              disabled={createPostMutation.isPending}
              onClick={form.handleSubmit(handleCreatePost)}
            >
              {createPostMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin" /> Submitting
                  question...
                </span>
              ) : (
                "Submit Question"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </Form>
  );
};
