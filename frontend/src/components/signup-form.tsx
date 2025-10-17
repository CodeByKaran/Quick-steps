"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-background-elevated border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your username"
                      {...field}
                      className="focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </FormControl>
                  {/* <FormDescription>Enter your username .</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </FormControl>
                  {/* <FormDescription>Enter your email address.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </FormControl>
                  {/* <FormDescription>Enter your password.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-5">
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="mt-4 flex justify-center items-center gap-2 text-xs text-foreground/70 pt-4">
          <p>already have account ?</p>{" "}
          <Link href="/sign-in" className="underline hover:text-foreground">
            sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
