"use client";
import React, { useTransition, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "../../../../actions/login";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { signInFormSchema } from "@/schemas/FormSchemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const Login: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function handleSubmit(values: z.infer<typeof signInFormSchema>) {
    setAuthError(null);
    setIsLoading(true);
    startTransition(async () => {
      try {
        const result = await login(values);
        if (result?.error) {
          setAuthError(result.error);
        }
      } catch (err) {
        console.error("Login error:", err);
        setAuthError("Alguma coisa aconteceu de errado.");
      } finally {
        setIsLoading(false);
      }
    });
  }

  return (
    <>
      {isLoading && (
        <div className="fullscreen-spinner">
          <Spinner visible={true} color="default" message="Loading Page..." />
        </div>
      )}
      <div
        className={`max-w-screen bg-white min-h-screen flex items-center justify-center ${
          isLoading ? "opacity-50" : ""
        }`}
      >
        <div className="w-1/4 flex flex-col gap-5 rounded border border-[#e2e8f0] p-7 shadow-md">
          <div className="w-full flex items-center justify-center">
            <Image src="/images/logo_pontalti_default.png" width={45} height={45} alt="Logo Pontalti" />
          </div>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Endereço de Email</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="font-semibold">Senha</FormLabel>
                    </div>
                    <FormControl>
                      <PasswordInput disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {authError && (
                <p className="text-sm font-medium text-destructive" role="alert">
                  {authError}
                </p>
              )}
              <Button className="w-full" type="submit" disabled={isPending}>
                Logar
              </Button>
              <div className="flex justify-center">
                <Link href="/auth/reset" tabIndex={-1} className="text-sm font-semibold text-primary hover:underline">
                  Esqueceu a Senha?
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
