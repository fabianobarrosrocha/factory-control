"use client";

import React, { useEffect, useState } from "react";

import Aside from "@/components/Aside";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Row, ColumnDef } from "@tanstack/react-table";
import DynamicTable from "@/components/DynamicTable";
import { TableColumn } from "@/models/TableColumn";
import { getProductFullLabel } from "@/utils/product-label";
import { 
  PurchaseForecastSummary, 
  MaterialForecast, 
  PriorityLabels,
  ProductionControlForecast
} from "@/types/purchase-forecast.types";

// Componente auxiliar para tabela de Production Controls
function ProductionControlsTable({ controls }: { controls: ProductionControlForecast[] }) {
  const columns: ColumnDef<ProductionControlForecast>[] = [
    {
      header: "ID",
      accessorKey: "id"
    },
    {
      header: "Pedido ID", 
      accessorKey: "order_id"
    },
    {
      header: "Status",
      accessorKey: "status"
    },
    {
      header: "Disponibilidade Material (%)",
      accessorKey: "material_disponibility",
      cell: ({ row }: { row: Row<ProductionControlForecast> }) => (
        <span className={row.original.material_disponibility < 50 ? "text-red-600 font-bold" : "text-green-600"}>
          {row.original.material_disponibility}%
        </span>
      )
    },
    {
      header: "Criado em",
      accessorKey: "created_at",
      cell: ({ row }: { row: Row<ProductionControlForecast> }) => (
        <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
      )
    }
  ];

  const filterFields = columns.reduce((acc: TableColumn<ProductionControlForecast>[], column) => {
    if ('accessorKey' in column && column.accessorKey && 'header' in column && column.header) {
      acc.push({ header: String(column.header), accessorKey: String(column.accessorKey) });
    }
    return acc;
  }, []);

  return (
    <DynamicTable
      isLoadingSpinner={false}
      columns={columns}
      data={controls}
      filterFields={filterFields}
    />
  );
}

// Componente auxiliar para tabela de Materials
function MaterialsTable({ materials }: { materials: MaterialForecast[] }) {
  const columns: ColumnDef<MaterialForecast>[] = [
    {
      header: "Produto",
      accessorKey: "material_order.product",
      cell: ({ row }) => {
        const product = row.original.material_order?.product;
        return product ? getProductFullLabel(product as any) : "-";
      }
    },
    {
      header: "Estoque Atual",
      accessorKey: "current_stock"
    },
    {
      header: "Qtd. Necessária",
      accessorKey: "required_quantity"
    },
    {
      header: "Déficit",
      accessorKey: "shortage_quantity",
      cell: ({ row }: { row: Row<MaterialForecast> }) => (
        <span className="text-red-600 font-bold">
          {row.original.shortage_quantity}
        </span>
      )
    },
    {
      header: "Custo Estimado",
      accessorKey: "estimated_cost",
      cell: ({ row }: { row: Row<MaterialForecast> }) => (
        <span>R$ {parseFloat(row.original.estimated_cost.toString()).toFixed(2)}</span>
      )
    },
    {
      header: "Prioridade",
      accessorKey: "priority",
      cell: ({ row }: { row: Row<MaterialForecast> }) => (
        <Badge variant={row.original.priority === 1 ? "destructive" : row.original.priority === 2 ? "secondary" : "outline"}>
          {PriorityLabels[row.original.priority] || 'Normal'}
        </Badge>
      )
    },
    {
      header: "Fornecedor",
      accessorKey: "material_order.vendor.store_name"
    }
  ];

  const filterFields = columns.reduce((acc: TableColumn<MaterialForecast>[], column) => {
    if ('accessorKey' in column && column.accessorKey && 'header' in column && column.header) {
      acc.push({ header: String(column.header), accessorKey: String(column.accessorKey) });
    }
    return acc;
  }, []);

  return (
    <DynamicTable
      isLoadingSpinner={false}
      columns={columns}
      data={materials}
      filterFields={filterFields}
    />
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const [forecastData, setForecastData] = useState<PurchaseForecastSummary>();

  const router = useRouter();

  useEffect(() => {
    const loadForecastData = async () => {
      try {
        // Primeiro, tentar buscar dados do localStorage
        const savedData = localStorage.getItem('purchase-forecast-data');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setForecastData(parsedData);
          console.log('Dados carregados do localStorage:', parsedData);
        } else {
          // Fallback: buscar da API se não houver dados no localStorage
          console.log('Dados não encontrados no localStorage, buscando da API...');
          const response = await fetch('/api/purchase-forecast');
          const data = await response.json();
          setForecastData(data);
          console.log('Dados carregados da API:', data);
        }
      } catch (err) {
        console.error("Error loading forecast details:", err);
      }
    };

    loadForecastData();
  }, [params.id]);

  const getPriorityVariant = (priority: number): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case 1: return "destructive";
      case 2: return "secondary";
      case 3: return "outline";
      case 4: return "default";
      default: return "default";
    }
  };

  return (
    <div className="page-layout">
      <nav className="aside-layout">
        <Aside />
      </nav>
      <main className="main-layout">
        <div className="grid px-20 pb-4 gap-4">
          <Header title="Detalhes da Previsão de Compra" backTo="/spent/purchase-order" />
          {forecastData && (
            <div className="space-y-6">
              {/* Resumo Geral */}
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Resumo da Previsão
                    </CardTitle>
                    <CardDescription>
                      Informações consolidadas dos materiais necessários
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold">Total de Materiais</div>
                        <div className="text-2xl font-bold">{forecastData.total_materials}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Materiais Urgentes</div>
                        <div className={`text-2xl font-bold ${forecastData.urgent_materials > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {forecastData.urgent_materials}
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="font-semibold">Custo Total Estimado</div>
                      <div className="text-3xl font-bold text-green-700">
                        R$ {parseFloat(forecastData.total_estimated_cost.toString()).toFixed(2)}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="font-semibold">Controles de Produção Associados</div>
                      <div className="text-lg">{forecastData.production_controls.length} controles</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Previsões de Material */}
              <Card>
                <CardHeader>
                  <CardTitle>Materiais Necessários</CardTitle>
                  <CardDescription>
                    Detalhamento dos materiais com estoque e necessidades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {forecastData.forecasts.map((forecast: MaterialForecast, index: number) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="font-semibold text-lg">
                                {forecast.material_order?.product
                                  ? getProductFullLabel(forecast.material_order.product as any)
                                  : "-"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {forecast.material_order.product.id}
                              </div>
                              <Badge variant={getPriorityVariant(forecast.priority)} className="mt-1">
                                {PriorityLabels[forecast.priority] || 'Normal'}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Estoque Atual:</span>
                                <span className="font-medium">{forecast.current_stock}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Quantidade Necessária:</span>
                                <span className="font-medium">{forecast.required_quantity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-red-600">Déficit:</span>
                                <span className="font-medium text-red-600">{forecast.shortage_quantity}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Custo Estimado:</span>
                                <span className="font-bold text-green-700">
                                  R$ {parseFloat(forecast.estimated_cost.toString()).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Unidade:</span>
                                <span className="font-medium">{forecast.material_order.unit}</span>
                              </div>
                              {forecast.expected_delivery_date && (
                                <div className="flex justify-between">
                                  <span className="text-sm">Entrega Prevista:</span>
                                  <span className="font-medium">
                                    {new Date(forecast.expected_delivery_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <strong>Fornecedor:</strong> {forecast.material_order.vendor.store_name}
                            </div>
                            <div>
                              <strong>Local de Armazenamento:</strong> {forecast.material_order.storage_location}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Controles de Produção - Tabela */}
              <Card>
                <CardHeader>
                  <CardTitle>Controles de Produção</CardTitle>
                  <CardDescription>
                    Ordens de produção que originaram esta previsão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductionControlsTable controls={forecastData.production_controls} />
                </CardContent>
              </Card>

              {/* Materiais - Tabela */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhamento dos Materiais</CardTitle>
                  <CardDescription>
                    Lista completa dos materiais com informações de estoque e custo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MaterialsTable materials={forecastData.forecasts} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

