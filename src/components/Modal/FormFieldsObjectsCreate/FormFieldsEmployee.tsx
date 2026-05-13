"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Classification } from "@/types/employee.types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { withMask } from "use-mask-input";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";

interface FormFieldsEmployee {
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

const help = fieldHelpTexts.employee;

export const FormFieldsEmployee: React.FC<FormFieldsEmployee> = ({ form }) => {
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
        key="phone"
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="phone" label="Número de Telefone" helpText={help.phone} optional />
            <FormControl>
              <Input id="phone" {...field} ref={withMask("(99) 9999-9999")} placeholder="ex. (99) 99999-9999" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="cel_number"
        control={form.control}
        name="cel_number"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="cel_number" label="Número de Celular" helpText={help.cel_number} />
            <FormControl>
              <Input id="cel_number" {...field} ref={withMask("(99) 99999-9999")} placeholder="ex. (99) 9999-9999" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="cpf"
        control={form.control}
        name="cpf"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="cpf" label="CPF" helpText={help.cpf} />
            <FormControl>
              <Input id="cpf" {...field} ref={withMask("999.999.999-99")} placeholder="999.999.999-99" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="birth_date"
        control={form.control}
        name="birth_date"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-between">
            <FormLabelWithHelp htmlFor="birth_date" label="Data de Nascimento" helpText={help.birth_date} optional />
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? format(field.value, "PPP") : <span>Escolha uma data</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  toDate={new Date()}
                  captionLayout="dropdown"
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="classification"
        control={form.control}
        name="classification"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="classification" label="Classificação" helpText={help.classification} />
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma classificação" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>{mapEnumToSelectItems(Classification)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="salary"
        control={form.control}
        name="salary"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="salary" label="Salário" helpText={help.salary} optional />
              <FormControl>
                <MoneyInput id="salary" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        key="admission"
        control={form.control}
        name="admission"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-between">
            <FormLabelWithHelp htmlFor="admission" label="Data de Admissão" helpText={help.admission} />
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
        key="dismissal_date"
        control={form.control}
        name="dismissal_date"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-between">
            <FormLabelWithHelp htmlFor="dismissal_date" label="Data de Demissão" helpText={help.dismissal_date} optional />
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? format(field.value, "PPP") : <span>Escolha uma data</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                  }}
                  fromDate={new Date()}
                  showOutsideDays={true}
                  fixedWeeks={true}
                  initialFocus={false}
                  captionLayout="dropdown"
                  />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
