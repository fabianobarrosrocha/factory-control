"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Product } from "@/types/product.types";
import { OrderItem } from "@/types/order-item.types";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";
import { getProductFullLabel } from "@/utils/product-label";

interface FormFieldsOrderProps {
  form: UseFormReturn;
}

const help = fieldHelpTexts.order;

/**
 * Busca o preço registrado para um produto. Se customerId for fornecido,
 * tenta o preço específico do cliente; em caso de 404, faz fallback para
 * o preço padrão (sem cliente). Retorna null se nada for encontrado.
 */
const fetchRegisteredPrice = async (
  productId: number,
  customerId?: number
): Promise<number | null> => {
  const tryFetch = async (url: string): Promise<number | null> => {
    try {
      const resp = await axios.get(url);
      // service retorna { data: Price } com final_price; aceita resp.data.data ou resp.data flat
      const price = resp.data?.data ?? resp.data;
      const finalPrice = Number(price?.final_price ?? 0);
      return finalPrice > 0 ? finalPrice : null;
    } catch {
      return null;
    }
  };

  if (customerId && customerId > 0) {
    const customerSpecific = await tryFetch(`/api/prices/product/${productId}/customer/${customerId}`);
    if (customerSpecific) return customerSpecific;
  }
  // Fallback para preço padrão (sem cliente)
  return tryFetch(`/api/prices/product/${productId}`);
};

export const FormFieldsOrder: React.FC<FormFieldsOrderProps> = ({ form }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);

  const customerIdValue = form.watch("customer_id");

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
    const currentProducts = form.getValues("products");
    if (currentProducts?.length) {
      setItems(currentProducts);
    }
  }, []);

  // Sync items → form
  useEffect(() => {
    form.setValue("products", items, { shouldValidate: items.length > 0 });
  }, [items, form]);

  // Compute final_price and discount reactively
  useEffect(() => {
    const subtotal = items.reduce((s, it) => s + (Number(it.unit_price) || 0) * (Number(it.quantity) || 0), 0);
    const totalDiscount = items.reduce((s, it) => {
      const reg = Number(it.registered_price) || 0;
      const unit = Number(it.unit_price) || 0;
      if (reg > unit) return s + (reg - unit) * (Number(it.quantity) || 0);
      return s;
    }, 0);
    form.setValue("final_price", subtotal, { shouldValidate: true });
    form.setValue("discount", totalDiscount, { shouldValidate: true });
  }, [items, form]);

  // Quando cliente muda, refazer fetch de preço para os produtos já adicionados
  useEffect(() => {
    if (items.length === 0) return;
    const customerId = Number(customerIdValue) || undefined;
    let cancelled = false;
    const refetch = async () => {
      const updated = await Promise.all(
        items.map(async (it) => {
          if (!it.product_id) return it;
          const reg = await fetchRegisteredPrice(it.product_id, customerId);
          return { ...it, registered_price: reg, unit_price: reg ?? it.unit_price };
        })
      );
      if (!cancelled) setItems(updated);
    };
    refetch();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerIdValue]);

  const addProduct = () => {
    setItems((curr) => [...curr, { product_id: 0, quantity: 1, unit_price: 0, registered_price: null }]);
  };

  const removeProduct = (index: number) => {
    setItems((curr) => curr.filter((_, i) => i !== index));
  };

  const updateProduct = async (index: number, patch: Partial<OrderItem>) => {
    const customerId = Number(customerIdValue) || undefined;
    let next: OrderItem = { ...items[index], ...patch };

    // Ao trocar de produto, busca o preço registrado (padrão ou específico do cliente)
    if (patch.product_id !== undefined && patch.product_id !== items[index].product_id) {
      const reg = await fetchRegisteredPrice(patch.product_id, customerId);
      next = { ...next, registered_price: reg, unit_price: reg ?? 0 };
    }

    // Restrição: unit_price não pode passar do registered_price
    if (patch.unit_price !== undefined && next.registered_price && next.registered_price > 0) {
      if (Number(patch.unit_price) > next.registered_price) {
        next.unit_price = next.registered_price;
      }
    }

    setItems((curr) => curr.map((it, i) => (i === index ? next : it)));
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
              <MoneyInput id="final_price" value={field.value} onChange={() => {}} readOnly />
            </FormControl>
            <p className="text-xs text-muted-foreground">Soma dos itens × quantidade.</p>
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
            <FormLabelWithHelp htmlFor="discount" label="Desconto" helpText={help.discount} />
            <FormControl>
              <MoneyInput id="discount" value={field.value} onChange={() => {}} readOnly />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Soma das diferenças (preço registrado − preço cobrado) × quantidade.
            </p>
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
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="customer_id" label="ID do cliente" helpText={help.customerId} />
            <FormControl>
              <Input
                id="customer_id"
                type="number"
                {...field}
                {...form.register("customer_id", { valueAsNumber: true })}
                placeholder="Insira o ID do cliente"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-3 space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel className="text-base">Produtos</FormLabel>
          <Button type="button" onClick={addProduct} variant="outline" size="sm">
            Adicionar produto
          </Button>
        </div>

        {!Number(customerIdValue) && (
          <p className="text-xs text-muted-foreground">
            Informe o ID do cliente primeiro para que os preços registrados sejam carregados.
          </p>
        )}

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum produto adicionado.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 items-end gap-2 border rounded-md p-3">
                <div className="col-span-5">
                  <FormLabel className="text-xs">Produto</FormLabel>
                  <Select
                    value={item.product_id ? String(item.product_id) : undefined}
                    onValueChange={(value) => updateProduct(index, { product_id: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {getProductFullLabel(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <FormLabel className="text-xs">Qtd.</FormLabel>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity || ""}
                    onChange={(e) => updateProduct(index, { quantity: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-4">
                  <FormLabel className="text-xs">Preço unitário</FormLabel>
                  <MoneyInput
                    value={item.unit_price}
                    onChange={(v) => updateProduct(index, { unit_price: v ?? 0 })}
                  />
                  {item.registered_price ? (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Registrado: R$ {Number(item.registered_price).toFixed(2)} (máximo)
                    </p>
                  ) : Number(customerIdValue) > 0 && item.product_id ? (
                    <p className="text-[11px] text-muted-foreground mt-1">Sem preço registrado para este cliente.</p>
                  ) : null}
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeProduct(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
