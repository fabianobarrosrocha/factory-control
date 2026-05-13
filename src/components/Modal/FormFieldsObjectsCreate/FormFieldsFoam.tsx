"use client";

import React from "react";

import { Status } from "@/types/common.types";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";

interface FormFieldsFoamProps {
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

const help = fieldHelpTexts.foam;

export const FormFieldsFoam: React.FC<FormFieldsFoamProps> = ({ form }) => {
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
              <Input id="name" {...field} placeholder="ex. D28" />
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
                placeholder="ex. D28"
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                maxLength={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="density"
        control={form.control}
        name="density"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="density" label="Densidade / descrição" helpText={help.density} optional />
            <FormControl>
              <Input id="density" {...field} placeholder="ex. 28kg/m³ — 30mm" />
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
