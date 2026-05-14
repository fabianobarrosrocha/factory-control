"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Aside from "@/components/Aside";
import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import DataList from "@/components/DataList";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import { SalesForecast, SalesForecastStatusLabel } from "@/types/sales-forecast.types";
import { PRODUCT_TYPE_LABELS } from "@/types/product.types";
import { getProductFullLabel, getProductSku } from "@/utils/product-label";

export default function Page({ params }: { params: { id: string } }) {
  const [salesForecast, setSalesForecast] = useState<SalesForecast | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/sales-forecasts/${params.id}`);
        const json = await response.json();
        setSalesForecast(json?.data ?? json);
      } catch (err) {
        console.error("Erro ao buscar previsão de venda:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <>
      {isLoading && (
        <div className="fullscreen-spinner">
          <Spinner visible={true} color="default" message="Loading Page..." />
        </div>
      )}
      <div className="page-layout">
        <nav className="aside-layout">
          <Aside />
        </nav>
        <main className="main-layout">
          <div className="grid px-20 pb-4 gap-4">
            <Header title="Informações da Previsão de Venda" backTo="/production/sales-forecast" />
            {salesForecast && (
              <div>
                <Card className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">Previsão #{salesForecast.id}</CardTitle>
                      <CardDescription>
                        <div className="text-xs text-muted-foreground">
                          Cliente: {salesForecast.customer?.name} · Produto:{" "}
                          {salesForecast.product ? getProductFullLabel(salesForecast.product as any) : "-"}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline" className="h-8 w-8">
                            <MoreVertical className="h-3.5 w-3.5" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                            <Modal typeModal="EDIT" typeRegister="SalesForecast" nameModal="previsão de venda" rowData={salesForecast} idRowData={salesForecast.id} />
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                            <Modal
                              typeModal="DELETE"
                              typeRegister="SalesForecast"
                              nameModal="previsão de venda"
                              rowData={salesForecast}
                              idRowData={salesForecast.id}
                              onDelete={() => {
                                router.push("/production/sales-forecast");
                              }}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                      <div className="font-semibold">Informações gerais</div>
                      <DataList
                        items={[
                          { title: "Identificador", data: String(salesForecast.id) },
                          { title: "Status", data: SalesForecastStatusLabel[salesForecast.status as keyof typeof SalesForecastStatusLabel] || String(salesForecast.status) },
                          { title: "Quantidade", data: String(salesForecast.quantity) },
                          { title: "Frequência", data: salesForecast.frequency_days ? `${salesForecast.frequency_days} dias` : "-" },
                          { title: "Próxima estimativa", data: salesForecast.next_estimated_date ? new Date(salesForecast.next_estimated_date).toLocaleDateString('pt-BR') : "-" },
                          { title: "Motivo", data: salesForecast.reason ?? "-" },
                        ]}
                      />
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Autorias</div>
                      <DataList
                        items={[
                          { title: "Criado por", data: salesForecast.created_by ?? "-" },
                          { title: "Atualizado por", data: salesForecast.updated_by ?? "-" },
                          { title: "Criado em", data: new Date(salesForecast.created_at).toLocaleDateString('pt-BR') },
                          { title: "Atualizado em", data: new Date(salesForecast.updated_at).toLocaleDateString('pt-BR') },
                        ]}
                      />
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Cliente</div>
                      <DataList
                        items={[
                          { title: "ID", data: String(salesForecast.customer?.id ?? "-") },
                          { title: "Nome", data: salesForecast.customer?.name ?? "-" },
                          { title: "Email", data: salesForecast.customer?.email ?? "-" },
                          { title: "Telefone", data: salesForecast.customer?.phone ?? "-" },
                        ]}
                      />
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Produto</div>
                      <DataList
                        items={[
                          { title: "ID", data: String(salesForecast.product?.id ?? "-") },
                          { title: "SKU", data: salesForecast.product ? getProductSku(salesForecast.product as any) : "-" },
                          {
                            title: "Tipo",
                            data: salesForecast.product?.type
                              ? PRODUCT_TYPE_LABELS[salesForecast.product.type] ?? salesForecast.product.type
                              : "-"
                          },
                          { title: "Cor interna", data: salesForecast.product?.inner_color?.name ?? "-" },
                          { title: "Espuma", data: salesForecast.product?.foam?.name ?? "-" },
                          { title: "Cor externa", data: salesForecast.product?.outer_color?.name ?? "-" },
                          { title: "Molde", data: salesForecast.product?.mold?.name ?? "-" }
                        ]}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                      Última atualização:{" "}
                      <time dateTime={new Date(salesForecast.updated_at).toString()}>
                        {new Date(salesForecast.updated_at).toLocaleString()}
                      </time>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}


