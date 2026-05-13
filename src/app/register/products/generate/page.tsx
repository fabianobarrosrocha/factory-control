"use client";

import React, { useEffect, useMemo, useState } from "react";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";

import Aside from "@/components/Aside";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Color } from "@/types/color.types";
import { Foam } from "@/types/foam.types";
import { Mold } from "@/types/mold.types";
import { Status } from "@/types/common.types";
import { PRODUCT_TYPE_LABELS, ProductType } from "@/types/product.types";
import { formProductGenerateSchema } from "@/schemas/FormSchemas";
import { productGenerateDefaultValues } from "@/schemas/DefaultValuesForm";

type FormValues = {
  type: ProductType;
  inner_color_ids: number[];
  foam_ids: number[];
  outer_color_ids: number[];
  mold_ids: number[];
  status: Status;
};

const toggleId = (list: number[], id: number) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

export default function GenerateVariantsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [colors, setColors] = useState<Color[]>([]);
  const [foams, setFoams] = useState<Foam[]>([]);
  const [molds, setMolds] = useState<Mold[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formProductGenerateSchema),
    defaultValues: productGenerateDefaultValues as unknown as FormValues
  });

  const watchType = form.watch("type");
  const watchInner = form.watch("inner_color_ids") ?? [];
  const watchFoam = form.watch("foam_ids") ?? [];
  const watchOuter = form.watch("outer_color_ids") ?? [];
  const watchMold = form.watch("mold_ids") ?? [];

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

  const previewCount = useMemo(() => {
    const base = watchInner.length * watchFoam.length * watchOuter.length;
    if (watchType === "bojo") return base * (watchMold.length || 0);
    return base;
  }, [watchInner, watchFoam, watchOuter, watchMold, watchType]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        mold_ids: values.type === "bojo" ? values.mold_ids : undefined
      };
      const resp = await axios.post("/api/products/generate", payload);
      const summary = resp.data?.summary ?? { created: 0, skipped: 0 };
      toast({
        title: "Variantes geradas",
        description: `${summary.created} criadas · ${summary.skipped} já existiam.`
      });
      router.push("/register/products");
    } catch (err) {
      const error = err as AxiosError;
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar variantes",
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-layout">
      <nav className="aside-layout">
        <Aside />
      </nav>
      <main className="main-layout">
        <div className="grid px-20 pb-4 gap-4">
          <Header title="Gerar variantes de Produto" backTo="/register/products" />
          <Card>
            <CardHeader>
              <CardTitle>Selecione os atributos</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6 pt-2">
                            {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((t) => (
                              <FormItem key={t} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={t} id={`gen-type-${t}`} />
                                </FormControl>
                                <FormLabel htmlFor={`gen-type-${t}`} className="font-normal">
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

                  <Separator />

                  <CheckboxGroup
                    title="Cores internas"
                    items={colors.map((c) => ({ id: c.id, label: c.name, sub: c.short_code }))}
                    selected={watchInner}
                    onChange={(ids) => form.setValue("inner_color_ids", ids, { shouldValidate: true })}
                    error={form.formState.errors.inner_color_ids?.message as string | undefined}
                  />

                  <CheckboxGroup
                    title="Espumas"
                    items={foams.map((f) => ({ id: f.id, label: f.name, sub: f.size }))}
                    selected={watchFoam}
                    onChange={(ids) => form.setValue("foam_ids", ids, { shouldValidate: true })}
                    error={form.formState.errors.foam_ids?.message as string | undefined}
                  />

                  <CheckboxGroup
                    title="Cores externas"
                    items={colors.map((c) => ({ id: c.id, label: c.name, sub: c.short_code }))}
                    selected={watchOuter}
                    onChange={(ids) => form.setValue("outer_color_ids", ids, { shouldValidate: true })}
                    error={form.formState.errors.outer_color_ids?.message as string | undefined}
                  />

                  {watchType === "bojo" && (
                    <CheckboxGroup
                      title="Moldes"
                      items={molds.map((m) => ({ id: m.id, label: m.name, sub: m.size }))}
                      selected={watchMold}
                      onChange={(ids) => form.setValue("mold_ids", ids, { shouldValidate: true })}
                      error={form.formState.errors.mold_ids?.message as string | undefined}
                    />
                  )}

                  <Separator />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="max-w-xs">
                        <FormLabel>Status das variantes</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
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

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {previewCount > 0
                        ? `Pré-visualização: ${previewCount} variante(s) serão criadas (duplicatas são puladas)`
                        : "Selecione ao menos um item em cada catálogo."}
                    </div>
                    <div className="flex gap-2">
                      <Link href="/register/products">
                        <Button type="button" variant="secondary" disabled={isSubmitting}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Voltar
                        </Button>
                      </Link>
                      <Button type="submit" disabled={isSubmitting || previewCount === 0}>
                        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Gerar variantes
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

interface CheckboxGroupProps {
  title: string;
  items: { id: number; label: string; sub?: string | null }[];
  selected: number[];
  onChange: (ids: number[]) => void;
  error?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, items, selected, onChange, error }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="font-semibold">{title}</Label>
        <span className="text-xs text-muted-foreground">{selected.length} selecionado(s)</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.length === 0 && <span className="text-sm text-muted-foreground">Nenhum item cadastrado.</span>}
        {items.map((item) => {
          const checked = selected.includes(item.id);
          return (
            <label
              key={item.id}
              className="flex items-center gap-2 rounded border px-3 py-2 hover:bg-muted/50 cursor-pointer"
            >
              <Checkbox checked={checked} onCheckedChange={() => onChange(toggleId(selected, item.id))} />
              <span className="text-sm">
                {item.label}
                {item.sub ? <span className="text-muted-foreground"> · {item.sub}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-sm font-medium text-destructive mt-1">{error}</p>}
    </div>
  );
};
