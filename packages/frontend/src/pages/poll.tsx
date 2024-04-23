import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function PollPage() {
  const [hasVoted, setHasVoted] = useState(false);

  const { id } = useParams();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["poll", id],
    queryFn: async () =>
      api
        .poll({ id: id! })
        .get()
        .then(x => x.data),
    enabled: !!id
  });

  async function vote(optionId: number) {
    if (!data?.id) return;

    await api.vote.index.post({ optionId, pollId: data.id });

    refetch();
    setHasVoted(true);
  }

  if (isLoading)
    return (
      <main className="flex w-full h-full items-center justify-center flex-col gap-y-4">
        <LoaderCircle className="animate-spin" />
      </main>
    );

  return (
    <main className="flex w-full h-full items-center flex-col gap-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {data?.title ?? "Poll not found.."}
      </h1>

      <div className="flex flex-col gap-y-4 w-64 lg:w-96">
        {data?.options.map((option, index) => (
          <div
            className="grid w-full max-w-sm items-center gap-1.5"
            key={option.text}
          >
            <Label htmlFor={option.text!}>Option {index + 1}</Label>

            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input id={option.text!} value={option.text!} readOnly />

              {hasVoted ? (
                <Button disabled>{option.votes ?? 0}</Button>
              ) : (
                <Button type="button" onClick={() => vote(option.id)}>
                  Vote
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
