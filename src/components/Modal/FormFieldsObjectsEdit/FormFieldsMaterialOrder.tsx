"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";
import { StorageLocationSelect } from "../StorageLocationSelect";

interface FormFieldsMaterialOrder {
  form: UseFormReturn;
}

const help = fieldHelpTexts.materialOrder;

export const FormFieldsMaterialOrder: React.FC<FormFieldsMaterialOrder> = ({ form }) => {
  return (
    <>
      <FormField
        key="date"
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-between">
            <FormLabelWithHelp htmlFor="date" label="Data do Pedido" helpText={help.date} />
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
        key="amount"
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="amount" label="Quantidade" helpText={help.amount} />
            <FormControl>
              <Input
                id="amount"
                type="number"
                {...field}
                placeholder="Insira a quantidade"
                className="w-full rounded-lg bg-background pl-8 pt-2.5"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="unit"
        control={form.control}
        name="unit"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="unit" label="Unidade de medida" helpText={help.unit} />
            <FormControl>
              <Input id="unit" {...field} placeholder="Insira a unidade de medida" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <StorageLocationSelect form={form} name="storage_location" helpText={help.storage_location} />

      <FormField
        key="received_by"
        control={form.control}
        name="received_by"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="received_by" label="Recebido por" helpText={help.received_by} />
            <FormControl>
              <Input id="received_by" {...field} placeholder="Insira o nome de quem recebeu" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="product.id"
        control={form.control}
        name="product.id"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="product.id" label="ID do produto" helpText={help.product_id} />
              <FormControl>
                <Input
                  id="product.id"
                  type="number"
                  {...field}
                  {...form.register("product.id", {
                    valueAsNumber: true
                  })}
                  placeholder="Insira o ID do produto"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        key="vendor.id"
        control={form.control}
        name="vendor.id"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="vendor.id" label="ID do fornecedor" helpText={help.vendor_id} />
              <FormControl>
                <Input
                  id="vendor.id"
                  type="number"
                  {...field}
                  {...form.register("vendor.id", {
                    valueAsNumber: true
                  })}
                  placeholder="Insira o ID do fornecedor"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
};
