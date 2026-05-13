"use client";

import React, { useState, useEffect } from "react";

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
import { ReturnedLabel } from "@/types/returned_labels.types";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";

interface FormFieldsPayment {
  form: UseFormReturn;
}

const help = fieldHelpTexts.payment;

export const FormFieldsPayment: React.FC<FormFieldsPayment> = ({ form }) => {
  return (
    <>
      <FormField
        key="amount_paid"
        control={form.control}
        name="amount_paid"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="amount_paid" label="Total pago" helpText={help.amountPaid} />
              <FormControl>
                <MoneyInput id="amount_paid" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
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
        key="payment_method"
        control={form.control}
        name="payment_method"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="payment_method" label="Método de pagamento" helpText={help.paymentMethod} />
            <FormControl>
              <Input id="payment_method" {...field} placeholder="Insira o metodo de pagamento" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="order_id"
        control={form.control}
        name="order_id"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="order_id" label="ID do pedido" helpText={help.orderId} />
              <FormControl>
                <Input
                  id="order_id"
                  type="number"
                  {...field}
                  {...form.register("order_id", {
                    valueAsNumber: true
                  })}
                  placeholder="Insira o ID do pedido"
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
