"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/lib/utils";
import { doTransaction } from "@/server/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormProps {
  type: string;
}

export default function BankingForm({ type }: FormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit({ amount }: z.infer<typeof formSchema>) {
    const result = await doTransaction({ amount, type });
    if (!result.success) {
      form.setError("amount", { message: result.error });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Amount" {...field} type="number" />
              </FormControl>
              <FormDescription>This is the amount to {type}.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="capitalize">
          {type}
        </Button>
      </form>
    </Form>
  );
}
