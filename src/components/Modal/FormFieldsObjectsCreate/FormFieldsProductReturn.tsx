"use client";

import React, { useState, useEffect } from "react";

import axios from "axios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBooleanLabel } from "@/services/formatInputs";
import { Order } from "@/types/order.types";
import { ReturnedLabel } from "@/types/returned_labels.types";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";
import { StorageLocationSelect } from "../StorageLocationSelect";

interface FormFieldsProductReturn {
  form: UseFormReturn;
}

const help = fieldHelpTexts.productReturn;

export const FormFieldsProductReturn: React.FC<FormFieldsProductReturn> = ({ form }) => {
  const [selectedLabels, setSelectedLabels] = useState<ReturnedLabel[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const resp = await axios.get("/api/orders");
        setOrders(resp.data.data ?? []);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    form.setValue("returned_labels", selectedLabels);
  }, [selectedLabels, form]);

  const addLabel = () => {
    const newLabels = [
      ...selectedLabels,
      {
        ticket_code: "",
        opened: "",
        quantity: 0
      }
    ];
    setSelectedLabels(newLabels);
    form.setValue("returned_labels", newLabels);
  };
  const removeLabel = (index: number) => {
    setSelectedLabels(selectedLabels.filter((_, i) => i !== index));
  };
  const updateLabel = (index: number, field: string, value: any) => {
    const updatedLabels = [...selectedLabels];
    updatedLabels[index] = {
      ...updatedLabels[index],
      [field]: value
    };
    setSelectedLabels(updatedLabels);
    form.setValue("returned_labels", updatedLabels);
  };

  return (
    <>
      <FormField
        key="product_return.date"
        control={form.control}
        name="product_return.date"
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
        key="product_return.replacement_necessary"
        control={form.control}
        name="product_return.replacement_necessary"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp
              htmlFor="replacement_necessary"
              label="É necessário substituição?"
              helpText={help.replacement_necessary}
            />
            <FormControl>
              <RadioGroup onValueChange={field.onChange}>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="true" id={`option-one-replacement_necessary`} />
                  </FormControl>
                  <FormLabel className="font-normal">{getBooleanLabel("replacement_necessary", 0)}</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="false" id={`option-two-replacement_necessary`} />
                  </FormControl>
                  <FormLabel className="font-normal">{getBooleanLabel("replacement_necessary", 1)}</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="product_return.resold"
        control={form.control}
        name="product_return.resold"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="resold" label="É revenda?" helpText={help.resold} />
            <FormControl>
              <RadioGroup onValueChange={field.onChange}>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="true" id={`option-one-resold`} />
                  </FormControl>
                  <FormLabel className="font-normal">{getBooleanLabel("resold", 0)}</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="false" id={`option-two-resold`} />
                  </FormControl>
                  <FormLabel className="font-normal">{getBooleanLabel("resold", 1)}</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="product_return.return_reason"
        control={form.control}
        name="product_return.return_reason"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="return_reason" label="Motivo da devolução" helpText={help.return_reason} />
            <FormControl>
              <Input id="return_reason" {...field} placeholder="Insira o motivo da devolução" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <StorageLocationSelect
        form={form}
        name="product_return.storage_location"
        label="Local de armazenamento"
        helpText={help.storage_location}
      />

      <FormField
        key="product_return.order_id"
        control={form.control}
        name="product_return.order_id"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabelWithHelp htmlFor="product_return.order_id" label="Pedido" helpText={help.order_id} />
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={(value) => {
                  const orderId = Number(value);
                  field.onChange(orderId);
                  const selectedOrder = orders.find((o) => o.id === orderId);
                  if (selectedOrder?.date) {
                    form.setValue("product_return.date", new Date(selectedOrder.date));
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger id="product_return.order_id">
                    <SelectValue placeholder="Selecione o pedido" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={String(order.id)}>
                      {`Pedido #${order.id}`}
                      {order.customer?.name ? ` — ${order.customer.name}` : ""}
                      {order.date ? ` (${format(new Date(order.date), "dd/MM/yyyy")})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="returned_labels"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Produtos</FormLabel>
                <Button type="button" onClick={addLabel}>
                  Adicionar Produto
                </Button>
              </div>
              <div className="max-h-[200px] overflow-y-auto space-y-4">
                {selectedLabels.map((returned_labels, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Input
                      id="returned_labels.ticket_code"
                      value={returned_labels.ticket_code}
                      onChange={(e) => updateLabel(index, "ticket_code", e.target.value)}
                      placeholder="Insira o código da etiqueta"
                    />
                    <FormField
                      key="returned_labels.opened"
                      control={form.control}
                      name="returned_labels.opened"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="opened">Foi aberto?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={returned_labels.opened}
                              onValueChange={(value) => {
                                updateLabel(index, "opened", value);
                                field.onChange(selectedLabels);
                              }}
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="true" id={`option-one-opened`} />
                                </FormControl>
                                <FormLabel className="font-normal">{getBooleanLabel("opened", 0)}</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="false" id={`option-two-opened`} />
                                </FormControl>
                                <FormLabel className="font-normal">{getBooleanLabel("opened", 1)}</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Input
                      type="number"
                      value={returned_labels.quantity}
                      onChange={(e) => updateLabel(index, "quantity", parseInt(e.target.value))}
                      className="w-20"
                      placeholder="Qtd."
                    />
                    <Button type="button" onClick={() => removeLabel(index)} variant="destructive">
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};
