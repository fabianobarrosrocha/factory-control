"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";
import { Product } from "@/types/product.types";
import { Vendor } from "@/types/vendor.types";
import { getProductFullLabel } from "@/utils/product-label";
import { StorageLocationSelect } from "../StorageLocationSelect";

interface FormFieldsMaterialOrder {
  form: UseFormReturn;
}

const help = fieldHelpTexts.materialOrder;

export const FormFieldsMaterialOrder: React.FC<FormFieldsMaterialOrder> = ({ form }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [productsResp, vendorsResp] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/vendors")
        ]);
        setProducts(Array.isArray(productsResp.data) ? productsResp.data : productsResp.data?.data ?? []);
        setVendors(Array.isArray(vendorsResp.data) ? vendorsResp.data : vendorsResp.data?.data ?? []);
      } catch (err) {
        console.error("Erro ao buscar produtos/fornecedores:", err);
      }
    };
    fetchOptions();
  }, []);

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
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  toDate={new Date()}
                  initialFocus
                />
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
              <Input id="amount" type="number" {...field} placeholder="Insira a quantidade" />
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
            <FormLabelWithHelp htmlFor="nome_loja" label="Recebido por" helpText={help.received_by} />
            <FormControl>
              <Input id="received_by" {...field} placeholder="Insira o nome de quem recebeu" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="product_id"
        control={form.control}
        name="product_id"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="product_id" label="Produto" helpText={help.product_id} />
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <FormControl>
                <SelectTrigger id="product_id">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {getProductFullLabel(product)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="vendor_id"
        control={form.control}
        name="vendor_id"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="vendor_id" label="Fornecedor" helpText={help.vendor_id} />
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <FormControl>
                <SelectTrigger id="vendor_id">
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={String(vendor.id)}>
                    {vendor.name}
                    {vendor.store_name ? ` — ${vendor.store_name}` : ""}
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
