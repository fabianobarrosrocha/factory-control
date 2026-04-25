"use client";
import React, { useEffect, useState } from "react";

import { z } from "zod";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { strongPasswordSchema } from "@/schemas/FormSchemas";

const passwordChangeformSchema = z
  .object({
    password: strongPasswordSchema,
    confirm_password: z.string()
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não combinam",
    path: ["confirm_password"]
  });

const PasswordChange: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<z.infer<typeof passwordChangeformSchema>>({
    resolver: zodResolver(passwordChangeformSchema),
    defaultValues: {
      password: "",
      confirm_password: ""
    }
  });

  async function onSubmit(values: z.infer<typeof passwordChangeformSchema>) {
    setIsLoading(true);
    try {
      console.log(values);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && (
        <div className="fullscreen-spinner">
          <Spinner visible={true} color="default" message="Loading Page..." />
        </div>
      )}
      <div className="max-w-screen min-h-screen flex items-center justify-center">
        <div className="w-1/4 flex flex-col gap-5 rounded border border-[#e2e8f0] p-7 shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Senha</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="font-semibold">Confirme a sua Senha</FormLabel>
                    </div>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Trocar senha
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default PasswordChange;
