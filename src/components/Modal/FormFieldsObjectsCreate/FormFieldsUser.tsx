"use client";

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";
import { ACCESS_LEVELS, ACCESS_LEVEL_LABELS } from "@/types/user.types";

interface FormFieldsUserProps {
  form: UseFormReturn<any>;
}

const help = fieldHelpTexts.user;

export const FormFieldsUser: React.FC<FormFieldsUserProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp label="Nome" helpText={help.name} />
            <FormControl>
              <Input placeholder="Nome do usuário" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp label="Email" helpText={help.email} />
            <FormControl>
              <Input type="email" placeholder="Email do usuário" {...field} />
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
            <FormLabelWithHelp label="Senha" helpText={help.password} />
            <FormControl>
              <PasswordInput placeholder="Senha" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="access_level"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp label="Nível de Acesso" helpText={help.access_level} />
            <Select onValueChange={field.onChange} value={field.value ?? undefined}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível de acesso" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ACCESS_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {ACCESS_LEVEL_LABELS[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
