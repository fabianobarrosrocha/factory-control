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
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Product } from "@/types/product.types";
import { Status } from "@/types/common.types";
import { getProductFullLabel } from "@/utils/product-label";
import { OrderItem } from "@/types/order-item.types";
import axios from "axios";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";

interface FormFieldsOrder {
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

const help = fieldHelpTexts.order;

export const FormFieldsOrder: React.FC<FormFieldsOrder> = ({ form }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<OrderItem[]>([]);
  const [priceCache, setPriceCache] = useState<Record<string, number>>({});

  const customerIdValue = form.watch("customer_id");
  const discountValue = form.watch("discount");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resp = await axios.get("/api/products");
        const list = Array.isArray(resp.data) ? resp.data : resp.data?.data ?? [];
        setProducts(list);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    form.setValue("products", selectedProducts);
  }, [selectedProducts, form]);

  useEffect(() => {
    const currentProducts = form.getValues("products");
    if (currentProducts?.length) {
      setSelectedProducts(currentProducts);
    }
  }, []);

  useEffect(() => {
    const customerId = Number(customerIdValue);
    if (!customerId) return;
    const productIds = selectedProducts
      .map((p) => p.product_id)
      .filter((id): id is number => !!id && id > 0);
    const missing = productIds.filter((pid) => priceCache[`${pid}:${customerId}`] === undefined);
    if (missing.length === 0) return;

    const fetchPrices = async () => {
      const updates: Record<string, number> = {};
      await Promise.all(
        missing.map(async (productId) => {
          try {
            const resp = await axios.get(`/api/prices/product/${productId}/customer/${customerId}`);
            const finalPrice = Number(resp.data?.final_price ?? 0);
            updates[`${productId}:${customerId}`] = finalPrice;
          } catch (err) {
            updates[`${productId}:${customerId}`] = 0;
          }
        })
      );
      setPriceCache((prev) => ({ ...prev, ...updates }));
    };
    fetchPrices();
  }, [selectedProducts, customerIdValue, priceCache]);

  useEffect(() => {
    const customerId = Number(customerIdValue);
    if (!customerId) return;
    const subtotal = selectedProducts.reduce((sum, item) => {
      const unit = priceCache[`${item.product_id}:${customerId}`] ?? 0;
      const qty = Number(item.quantity) || 0;
      return sum + unit * qty;
    }, 0);
    const discount = Number(discountValue) || 0;
    const finalPrice = Math.max(0, subtotal - discount);
    form.setValue("final_price", finalPrice, { shouldValidate: true });
  }, [selectedProducts, customerIdValue, discountValue, priceCache, form]);

  const addProduct = () => {
    const newProducts = [...selectedProducts, { product_id: 0, quantity: 0 }];
    setSelectedProducts(newProducts);
    form.setValue("products", newProducts);
  };
  const removeProduct = (index: number, field: string, value: number) => {
    const newProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(newProducts);
    form.setValue("products", newProducts);
  };
  const updateProduct = (index: number, field: string, value: any) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: field === "product_id" ? Number(value) : value
    };
    setSelectedProducts(updatedProducts);
    form.setValue("products", updatedProducts);
  };

  return (
    <>
      <FormField
        key="final_price"
        control={form.control}
        name="final_price"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="final_price" label="Preço Final" helpText={help.finalPrice} />
            <FormControl>
              <MoneyInput
                id="final_price"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                readOnly
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Calculado automaticamente a partir dos produtos e do desconto.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        key="discount"
        control={form.control}
        name="discount"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="discount" label="Desconto" helpText={help.discount} optional />
            <FormControl>
              <MoneyInput id="discount" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
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
        key="customer_id"
        control={form.control}
        name="customer_id"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="customer_id" label="ID do cliente" helpText={help.customerId} />
              <FormControl>
                <Input
                  id="customer_id"
                  type="number"
                  {...field}
                  {...form.register("customer_id", {
                    valueAsNumber: true
                  })}
                  placeholder="Insira o ID do cliente"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {products && (
        <FormField
          control={form.control}
          name="products"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Produtos</FormLabel>
                  <Button type="button" onClick={addProduct}>
                    Adicionar Produto
                  </Button>
                </div>
                <div className="max-h-[200px] overflow-y-auto space-y-4">
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Select
                        value={product.product_id.toString()}
                        onValueChange={(value) => {
                          updateProduct(index, "product_id", parseInt(value));
                          field.onChange(selectedProducts);
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {getProductFullLabel(p)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => {
                          updateProduct(index, "quantity", parseInt(e.target.value));
                          field.onChange(selectedProducts);
                        }}
                        className="w-20"
                        placeholder="Qtd."
                      />
                      <Button
                        type="button"
                        onClick={() => removeProduct(index, "product_id", selectedProducts[index].product_id)}
                        variant="destructive"
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </FormItem>
          )}
        />
      )}
    </>
  );
};
