"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { Status } from "@/types/common.types";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";

interface FormFieldsProduct {
  form: UseFormReturn;
}

type EnumType<T> = {
  [key: string]: T;
};

function mapEnumToSelectItems<T extends string>(enumObj: EnumType<T>): JSX.Element[] {
  return Object.keys(enumObj).map((key) => (
    <SelectItem key={key} value={enumObj[key]}>
      {String(enumObj[key])}
    </SelectItem>
  ));
}

const help = fieldHelpTexts.product;

export const FormFieldsProduct: React.FC<FormFieldsProduct> = ({ form }) => {
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
              <Input id="name" {...field} placeholder="Insira o nome" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="model"
        control={form.control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="model" label="Modelo" helpText={help.model} />
            <FormControl>
              <Input id="model" {...field} placeholder="Insira o modelo" />
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
              <Input id="name" {...field} placeholder="Insira o tamanho" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="sales"
        control={form.control}
        name="sales"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="sales" label="Número de vendas" helpText={help.sales} />
              <FormControl>
                <Input
                  id="sales"
                  type="number"
                  {...field}
                  {...form.register("sales", {
                    valueAsNumber: true
                  })}
                  placeholder="Insira o número de vendas"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        key="volume_sales"
        control={form.control}
        name="volume_sales"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp
                htmlFor="volume_sales"
                label="Número do volume de vendas"
                helpText={help.volume_sales}
              />
              <FormControl>
                <Input
                  id="volume_sales"
                  type="number"
                  {...field}
                  {...form.register("volume_sales", {
                    valueAsNumber: true
                  })}
                  placeholder="Insira o número do volúme de vendas"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        key="invoicing"
        control={form.control}
        name="invoicing"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="invoicing" label="Faturamento" helpText={help.invoicing} />
              <FormControl>
                <MoneyInput id="invoicing" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        key="moldes"
        control={form.control}
        name="moldes"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="moldes" label="Quantidade de moldes" helpText={help.moldes} />
              <FormControl>
                <Input
                  id="moldes"
                  type="number"
                  {...field}
                  {...form.register("moldes", {
                    valueAsNumber: true
                  })}
                  placeholder="Insira os moldes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        key="equivalency"
        control={form.control}
        name="equivalency"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="equivalency" label="Equivalência" helpText={help.equivalency} />
              <FormControl>
                <Input
                  id="equivalency"
                  type="number"
                  {...field}
                  {...form.register("equivalency", {
                    valueAsNumber: true
                  })}
                  placeholder="Insira a equivalência"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
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
                  <SelectValue placeholder="Selecione um status do produto" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>{mapEnumToSelectItems(Status)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="character"
        control={form.control}
        name="character"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="character" label="Característica" helpText={help.character} />
            <FormControl>
              <Textarea id="name" {...field} placeholder="Insira a característica" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
