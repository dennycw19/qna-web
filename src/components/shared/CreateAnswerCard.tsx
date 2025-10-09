"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { AvatarComponent } from "./AvatarComponent";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const answerFormSchema = z.object({
  body: z.string().min(1).max(1000),
});

type answerFormSchema = z.infer<typeof answerFormSchema>;

type CreateAnswerCardProps = {
  postId: string;
};

export const CreateAnswerCard = (props: CreateAnswerCardProps) => {
  const { data: session, status } = useSession();

  const form = useForm<answerFormSchema>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: {
      body: "",
    },
  });

  const apiUtils = api.useUtils();

  const createAnswerMutation = api.answer.createAnswer.useMutation({
    onSuccess: async () => {
      // alert("Answer Submitted!");
      toast.success("Answer Submitted!");

      form.reset();
      // await apiUtils.answer.getAnswersByPostId.invalidate({
      //   postId: props.postId,
      // });
      await apiUtils.answer.getAnswersByPostId.invalidate({});
      await apiUtils.answer.getAnswerPaginated.invalidate({
        postId: props.postId,
      });
    },
  });

  const handleSubmitAnswer = (values: answerFormSchema) => {
    createAnswerMutation.mutate({
      body: values.body,
      postId: props.postId,
    });
  };

  const handleSignIn = async () => {
    await signIn("google");
  };

  const getAnswersQuery = api.answer.getAnswersByPostId.useQuery({
    postId: props.postId,
  });

  return (
    <div className="space-y-3">
      <h3 className="flex items-center text-2xl font-bold">
        {getAnswersQuery.isLoading ? (
          <Skeleton className="h-5 w-5 items-center mr-2" />
        ) : (
          getAnswersQuery.data?.length
        )}{" "}
        Answers
      </h3>
      <Form {...form}>
        <Card>
          <CardHeader className="text-2xl">
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          {status == "loading" ? (
            <CardContent>
              <Skeleton className="h-30 w-full" />
            </CardContent>
          ) : !!session ? (
            <CardContent>
              <div className="flex gap-4">
                <AvatarComponent
                  name={session?.user.name!}
                  image={session?.user.image!}
                />
                <div className="w-full space-y-1.5">
                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Details of your answer.."
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
                  You have to be signed in to answer this question
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
                disabled={createAnswerMutation.isPending}
                onClick={form.handleSubmit(handleSubmitAnswer)}
              >
                {createAnswerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2Icon className="animate-spin" />
                    Submitting answer...
                  </span>
                ) : (
                  "Submit Answer"
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </Form>
    </div>
  );
};
