import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, TrashIcon } from "lucide-react";
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const formSchema = z.object({
  title: z.string().min(1),
  options: z.array(z.object({ text: z.string().min(1) }))
});

type Schema = z.infer<typeof formSchema>;

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      options: [{ text: "" }]
    }
  });

  const options = useFieldArray({
    control: form.control,
    name: "options"
  });

  async function onSubmit(data: Schema) {
    setLoading(true);

    try {
      const resp = await api.poll.index.post({
        title: data.title,
        options: data.options.map(option => option.text)
      });

      navigate(`/poll/${resp.data?.pollId}`);
    } catch {
      toast.error("Failed to create poll");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex w-full h-full items-center flex-col gap-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Create a poll
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-64 lg:w-96"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-y-2">
            {options.fields.map((option, index) => (
              <FormField
                control={form.control}
                name={`options.${index}.text`}
                key={option.id}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option {index + 1}</FormLabel>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <FormControl>
                        <Input placeholder="Option" {...field} />
                      </FormControl>
                      {options.fields.length > 1 && (
                        <Button
                          type="submit"
                          variant="destructive"
                          onClick={() => options.remove(index)}
                        >
                          <TrashIcon size="16px" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="button"
              className="w-full"
              variant="secondary"
              onClick={() => options.append({ text: "" })}
            >
              Add option
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
