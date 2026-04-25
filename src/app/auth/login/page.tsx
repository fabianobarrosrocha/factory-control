"use client";
import React, { useTransition, useEffect, useState } from "react";
import Image from "next/image";

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
    setIsLoading(true);
    startTransition(async () => {
      try {
        login(values);
      } catch (err) {
        console.error("Login error:", err);
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
                      <Button type="button" className="p-0 h-0 font-semibold" variant="link">
                        Esqueceu a Senha?
                      </Button>
                    </div>
                    <FormControl>
                      <PasswordInput disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isPending}>
                Logar
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
