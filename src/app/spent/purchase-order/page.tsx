"use client";
import { useState, useEffect } from "react";

import "./PurchaseOrder.css";
import axios from "axios";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { Row, ColumnDef } from "@tanstack/react-table";
import Modal from "@/components/Modal/Modal";
import { MoreHorizontal } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DynamicTable from "@/components/DynamicTable";
import { TableColumn } from "@/models/TableColumn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import Header from "@/components/Header";
import type { PurchaseForecastSummary } from "@/types/purchase-forecast.types";

export default function Page() {
  const [data, setData] = useState<PurchaseForecastSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/purchase-forecast");
        console.log(resp.data);
        // A API retorna um objeto único, então vamos colocá-lo em um array
        if (resp.data && typeof resp.data === "object") {
          setData([resp.data]);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching purchase forecast data:", err);
        // Se não houver dados da API, definir array vazio por enquanto
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();

  const columns: ColumnDef<PurchaseForecastSummary>[] = [
    {
      header: "Total de Materiais",
      accessorKey: "total_materials"
    },
    {
      header: "Materiais Urgentes",
      accessorKey: "urgent_materials",
      cell: ({ row }: { row: Row<PurchaseForecastSummary> }) => (
        <span className={row.original.urgent_materials > 0 ? "text-red-600 font-bold" : "text-green-600"}>
          {row.original.urgent_materials}
        </span>
      )
    },
    {
      header: "Custo Total Estimado",
      accessorKey: "total_estimated_cost",
      cell: ({ row }: { row: Row<PurchaseForecastSummary> }) => (
        <span>R$ {parseFloat(row.original.total_estimated_cost.toString()).toFixed(2)}</span>
      )
    },
    {
      header: "Controles de Produção",
      accessorKey: "production_controls",
      cell: ({ row }: { row: Row<PurchaseForecastSummary> }) => <span>{row.original.production_controls.length}</span>
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<PurchaseForecastSummary> }) => {
        const forecast = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  // Salvar dados no localStorage antes de navegar
                  localStorage.setItem("purchase-forecast-data", JSON.stringify(forecast));
                  router.push(`/spent/purchase-order/${row.index + 1}`);
                }}
              >
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const arrayFilterFieldsByAcessorKey = columns.reduce((acc: TableColumn<PurchaseForecastSummary>[], column) => {
    if ("accessorKey" in column && column.accessorKey && "header" in column && column.header) {
      acc.push({ header: String(column.header), accessorKey: String(column.accessorKey) });
    }
    return acc;
  }, []);

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
          <Header title="Previsão e Emissão de ordem de compra" />
          <DynamicTable
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            onRowClick={(rowData, rowIndex) => {
              // Salvar dados no localStorage e navegar
              localStorage.setItem("purchase-forecast-data", JSON.stringify(rowData));
              router.push(`/spent/purchase-order/${rowIndex + 1}`);
            }}
          />
        </main>
      </div>
    </>
  );
}
