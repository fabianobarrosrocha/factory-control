"use client";

import React from "react";

import { Status } from "@/types/common.types";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";

interface FormFieldsMoldProps {
  form: UseFormReturn;
}

type EnumType<T> = { [key: string]: T };

function mapEnumToSelectItems<T extends string>(enumObj: EnumType<T>): JSX.Element[] {
  return Object.keys(enumObj).map((key) => (
    <SelectItem key={key} value={enumObj[key]}>
      {String(enumObj[key])}
    </SelectItem>
  ));
}

const help = fieldHelpTexts.mold;

export const FormFieldsMold: React.FC<FormFieldsMoldProps> = ({ form }) => {
  return (
    <>
      <FormField
        key="name"
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="name" label="Nome" helpText={help.name} />
            <FormControl>
              <Input id="name" {...field} placeholder="ex. Molde 18" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="short_code"
        control={form.control}
        name="short_code"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="short_code" label="Código curto" helpText={help.short_code} />
            <FormControl>
              <Input
                id="short_code"
                {...field}
                placeholder="ex. M18"
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                maxLength={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="size"
        control={form.control}
        name="size"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="size" label="Tamanho" helpText={help.size} />
            <FormControl>
              <Input id="size" {...field} placeholder="ex. P, M, G" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="description"
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="description" label="Descrição" helpText={help.description} optional />
            <FormControl>
              <Input id="description" {...field} placeholder="ex. Tamanho 18 — bojo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="status"
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="status" label="Status" helpText={help.status} />
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>{mapEnumToSelectItems(Status)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
