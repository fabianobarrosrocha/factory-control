"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import Header from "@/components/Header";
import { Location } from "@/types/location.types";
import { Machine } from "@/types/machine.types";
import { Stock } from "@/types/stock.types";
import { Button } from "@/components/ui/button";
import { getProductLabel } from "@/utils/product-label";
import {
  ArrowLeft,
  Cog,
  Package,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ClipboardList,
  AlertTriangle,
  Clock,
  User
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProductionControlWithDetails = {
  id: number;
  order_id: number;
  status: number;
  production_priority: number;
  estimated_start_date?: string;
  estimated_end_date?: string;
  actual_start_date?: string;
  order?: {
    id: number;
    customer?: {
      id: number;
      name: string;
      store_name?: string;
    };
    products?: Array<{
      product?: {
        id: number;
        name: string;
        model: string;
      };
      quantity: number;
    }>;
  };
};

type LocationWithDetails = Location & {
  machines: Machine[];
  stocks: (Stock & { product?: { id: number; name: string; model: string } })[];
};

const statusLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Planejamento", color: "bg-blue-100 text-blue-700" },
  2: { label: "Em Produção", color: "bg-green-100 text-green-700" },
  3: { label: "Concluído", color: "bg-gray-100 text-gray-700" },
  4: { label: "Pausado", color: "bg-yellow-100 text-yellow-700" },
  5: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

const priorityLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Urgente", color: "bg-red-500 text-white" },
  2: { label: "Alta", color: "bg-orange-500 text-white" },
  3: { label: "Normal", color: "bg-blue-500 text-white" },
  4: { label: "Baixa", color: "bg-gray-500 text-white" },
};

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [location, setLocation] = useState<LocationWithDetails | null>(null);
  const [productionOrders, setProductionOrders] = useState<ProductionControlWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch location with details (includes machines and stocks)
        const locationResp = await axios.get(`/api/locations/${params.id}`);
        setLocation(locationResp.data);

        // Fetch active production orders
        const productionResp = await axios.get("/api/production-control");
        const allProduction = productionResp.data.data || [];
        // Filter to show only active orders (status 1: Planning, 2: In Production)
        const activeOrders = allProduction.filter(
          (p: ProductionControlWithDetails) => p.status === 1 || p.status === 2
        );
        setProductionOrders(activeOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const activeMachines = location?.machines?.filter(
    (m) => m.status === 1 || m.status === "Ativo"
  ) || [];

  const inactiveMachines = location?.machines?.filter(
    (m) => m.status !== 1 && m.status !== "Ativo"
  ) || [];

  const totalStock = location?.stocks?.reduce(
    (acc, stock) => acc + (stock.amount || 0),
    0
  ) || 0;

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
          <Header title={location?.name || "Detalhes da Localização"} />

          <div className="p-6 overflow-auto" style={{ maxHeight: "calc(100vh - 80px)" }}>
            {/* Back Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Mapa
            </Button>

            {location && (
              <div className="space-y-6">
                {/* Location Info Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-6 h-6 rounded-full border-2"
                        style={{ backgroundColor: location.color }}
                      />
                      <div>
                        <CardTitle className="text-2xl">
                          {location.code} - {location.name}
                        </CardTitle>
                        <CardDescription>
                          Dimensões: {location.width}px x {location.height}px
                        </CardDescription>
                      </div>
                      <Badge
                        variant={activeMachines.length > 0 ? "default" : "secondary"}
                        className={activeMachines.length > 0 ? "bg-green-500" : ""}
                      >
                        {activeMachines.length > 0 ? "Produzindo" : "Parado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">
                          {location.machines?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500">Total de Máquinas</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">
                          {activeMachines.length}
                        </div>
                        <div className="text-sm text-gray-500">Máquinas Ativas</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600">
                          {totalStock}
                        </div>
                        <div className="text-sm text-gray-500">Itens em Estoque</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Production Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="w-5 h-5" />
                      Ordens de Produção Ativas
                    </CardTitle>
                    <CardDescription>
                      Pedidos atualmente em planejamento ou produção
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {productionOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma ordem de produção ativa no momento</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {productionOrders.map((production) => (
                          <div
                            key={production.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Badge className={priorityLabels[production.production_priority]?.color || "bg-gray-500"}>
                                  {priorityLabels[production.production_priority]?.label || "Normal"}
                                </Badge>
                                <Badge className={statusLabels[production.status]?.color || "bg-gray-100"}>
                                  {statusLabels[production.status]?.label || "Desconhecido"}
                                </Badge>
                              </div>
                              <Link href={`/production/production-control`}>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                  <User className="w-4 h-4" />
                                  <span className="font-medium">Cliente:</span>
                                </div>
                                <p className="text-sm ml-6">
                                  {production.order?.customer?.name || production.order?.customer?.store_name || `Pedido #${production.order_id}`}
                                </p>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                  <Clock className="w-4 h-4" />
                                  <span className="font-medium">Previsão:</span>
                                </div>
                                <p className="text-sm ml-6">
                                  {production.estimated_end_date
                                    ? new Date(production.estimated_end_date).toLocaleDateString('pt-BR')
                                    : "Não definida"}
                                </p>
                              </div>
                            </div>

                            {production.order?.products && production.order.products.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-gray-500 mb-2">Produtos:</p>
                                <div className="flex flex-wrap gap-2">
                                  {production.order.products.slice(0, 3).map((item, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {item.product ? getProductLabel(item.product as any) : "Produto"} ({item.quantity}x)
                                    </Badge>
                                  ))}
                                  {production.order.products.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{production.order.products.length - 3} mais
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Machines Section */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Active Machines */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        Máquinas Ativas ({activeMachines.length})
                      </CardTitle>
                      <CardDescription>
                        Máquinas com status operacional
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activeMachines.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          Nenhuma máquina ativa nesta localização
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {activeMachines.map((machine) => (
                            <Link
                              key={machine.id}
                              href={`/register/machines/${machine.id}`}
                              className="block"
                            >
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <Cog className="w-5 h-5 text-green-600" />
                                  <div>
                                    <div className="font-medium">{machine.model}</div>
                                    <div className="text-sm text-gray-500">
                                      Máquina #{machine.machine_number}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                                    Ativo
                                  </Badge>
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Inactive Machines */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-600">
                        <XCircle className="w-5 h-5" />
                        Máquinas Inativas ({inactiveMachines.length})
                      </CardTitle>
                      <CardDescription>
                        Máquinas paradas ou em manutenção
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {inactiveMachines.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          Nenhuma máquina inativa nesta localização
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {inactiveMachines.map((machine) => (
                            <Link
                              key={machine.id}
                              href={`/register/machines/${machine.id}`}
                              className="block"
                            >
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <Cog className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <div className="font-medium">{machine.model}</div>
                                    <div className="text-sm text-gray-500">
                                      Máquina #{machine.machine_number}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="bg-gray-100 text-gray-600">
                                    Inativo
                                  </Badge>
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Stock Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Estoque nesta Localização
                    </CardTitle>
                    <CardDescription>
                      {location.stocks?.length || 0} produtos armazenados - Total: {totalStock} itens
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(location.stocks?.length || 0) === 0 ? (
                      <p className="text-gray-500 text-sm">
                        Nenhum item em estoque nesta localização
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {location.stocks?.map((stock) => (
                          <Link
                            key={stock.id}
                            href={`/production/stocks/${stock.id}`}
                            className="block"
                          >
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4 text-purple-600" />
                                  <span className="font-medium truncate">
                                    {stock.product ? getProductLabel(stock.product as any) : `Produto #${stock.product_id}`}
                                  </span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              </div>
                              {stock.product?.sku && (
                                <div className="text-sm text-gray-500 mb-2">
                                  SKU: {stock.product.sku}
                                </div>
                              )}
                              <div className="text-2xl font-bold text-purple-600">
                                {stock.amount}
                                <span className="text-sm font-normal text-gray-500 ml-1">
                                  unidades
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Info Card about Status */}
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700 text-base">
                      <AlertTriangle className="w-5 h-5" />
                      Sobre o Status de Produção
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-800 text-sm">
                    <p>
                      <strong>Status atual:</strong> O status &quot;Produzindo/Parado&quot; é baseado nas máquinas ativas nesta localização.
                    </p>
                    <p className="mt-2">
                      <strong>Ordens de Produção:</strong> As ordens mostradas acima são todas as ordens em planejamento ou produção do sistema.
                      Para vincular ordens específicas a esta localização, considere adicionar um campo de localização ao controle de produção.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
