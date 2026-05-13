"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import { Status } from "@/types/common.types";
import { UseFormReturn } from "react-hook-form";
import { Color } from "@/types/color.types";
import { Foam } from "@/types/foam.types";
import { Mold } from "@/types/mold.types";
import { PRODUCT_TYPE_LABELS, PRODUCT_TYPES, ProductType } from "@/types/product.types";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";
import { fieldHelpTexts } from "@/config/field-help-texts";

interface FormFieldsProductProps {
  form: UseFormReturn;
}

const help = fieldHelpTexts.product;

export const FormFieldsProduct: React.FC<FormFieldsProductProps> = ({ form }) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [foams, setFoams] = useState<Foam[]>([]);
  const [molds, setMolds] = useState<Mold[]>([]);

  const typeValue = form.watch("type") as ProductType | undefined;

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [colorsResp, foamsResp, moldsResp] = await Promise.all([
          axios.get("/api/colors"),
          axios.get("/api/foams"),
          axios.get("/api/molds")
        ]);
        setColors(colorsResp.data ?? []);
        setFoams(foamsResp.data ?? []);
        setMolds(moldsResp.data ?? []);
      } catch (err) {
        console.error("Erro ao buscar catálogos:", err);
      }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    if (typeValue === "dublado") {
      form.setValue("mold_id", undefined);
    }
  }, [typeValue, form]);

  return (
    <>
      <FormField
        key="type"
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="type" label="Tipo" helpText={help.type} />
            <FormControl>
              <RadioGroup value={field.value ?? ""} onValueChange={field.onChange} className="flex gap-6 pt-2">
                {PRODUCT_TYPES.map((t) => (
                  <FormItem key={t} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={t} id={`type-${t}`} />
                    </FormControl>
                    <FormLabel htmlFor={`type-${t}`} className="font-normal">
                      {PRODUCT_TYPE_LABELS[t]}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="inner_color_id"
        control={form.control}
        name="inner_color_id"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="inner_color_id" label="Cor interna" helpText={help.inner_color_id} />
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <FormControl>
                <SelectTrigger id="inner_color_id">
                  <SelectValue placeholder="Selecione a cor interna" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="foam_id"
        control={form.control}
        name="foam_id"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="foam_id" label="Espuma" helpText={help.foam_id} />
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <FormControl>
                <SelectTrigger id="foam_id">
                  <SelectValue placeholder="Selecione a espuma" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {foams.map((f) => (
                  <SelectItem key={f.id} value={String(f.id)}>
                    {f.name} {f.size ? `· ${f.size}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        key="outer_color_id"
        control={form.control}
        name="outer_color_id"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="outer_color_id" label="Cor externa" helpText={help.outer_color_id} />
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <FormControl>
                <SelectTrigger id="outer_color_id">
                  <SelectValue placeholder="Selecione a cor externa" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {typeValue === "bojo" && (
        <FormField
          key="mold_id"
          control={form.control}
          name="mold_id"
          render={({ field }) => (
            <FormItem>
              <FormLabelWithHelp htmlFor="mold_id" label="Molde" helpText={help.mold_id} />
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <FormControl>
                  <SelectTrigger id="mold_id">
                    <SelectValue placeholder="Selecione o molde" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {molds.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name} {m.size ? `· ${m.size}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        key="status"
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabelWithHelp htmlFor="status" label="Status" helpText={help.status} />
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(Status).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
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
