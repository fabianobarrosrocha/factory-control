"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";

interface FormFieldsExpense {
  form: UseFormReturn;
}

const help = fieldHelpTexts.expense;

export const FormFieldsExpense: React.FC<FormFieldsExpense> = ({ form }) => {
  return (
    <>
      <FormField
        key="amount"
        control={form.control}
        name="amount"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="amount" label="Valor" helpText={help.amount} />
              <FormControl>
                <MoneyInput id="amount" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        key="classification"
        control={form.control}
        name="classification"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="classification" label="Classificação" helpText={help.classification} />
            <FormControl>
              <Input id="classification" {...field} placeholder="Insira a classificação" />
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
            <FormLabelWithHelp htmlFor="description" label="Descrição" helpText={help.description} />
            <FormControl>
              <Textarea id="description" {...field} placeholder="Insira a descrição" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="justification"
        control={form.control}
        name="justification"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="justification" label="Justificativa" helpText={help.justification} />
            <FormControl>
              <Textarea id="justification" {...field} placeholder="Insira a justificativa" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="expense_date"
        control={form.control}
        name="expense_date"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-between">
            <FormLabelWithHelp htmlFor="expense_date" label="Data da Despesa" helpText={help.expense_date} />
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? format(field.value, "PPP") : <span>Escolha uma data</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="expense_actor_id"
        control={form.control}
        name="expense_actor_id"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="expense_actor_id" label="ID do Ator" helpText={help.expense_actor_id} />
              <FormControl>
                <Input
                  id="expense_actor_id"
                  type="number"
                  {...field}
                  {...form.register("expense_actor_id", {
                    valueAsNumber: true
                  })}
                  placeholder="Insira o ID do ator"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        key="requires_reimbursement"
        control={form.control}
        name="requires_reimbursement"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabelWithHelp
                htmlFor="requires_reimbursement"
                label="Requer Reembolso"
                helpText={help.requires_reimbursement}
              />
            </div>
          </FormItem>
        )}
      />

      <FormField
        key="applies_all_products"
        control={form.control}
        name="applies_all_products"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabelWithHelp
                htmlFor="applies_all_products"
                label="Aplica a Todos os Produtos"
                helpText={help.applies_all_products}
              />
            </div>
          </FormItem>
        )}
      />

      <FormField
        key="applies_all_machines"
        control={form.control}
        name="applies_all_machines"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabelWithHelp
                htmlFor="applies_all_machines"
                label="Aplica a Todas as Máquinas"
                helpText={help.applies_all_machines}
              />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};
