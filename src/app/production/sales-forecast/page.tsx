"use client";

import { useState, useEffect } from "react";

import "./SalesForecast.css";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import Modal from "@/components/Modal/Modal";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import DynamicTable from "@/components/DynamicTable";
import { DataRow, TableColumn } from "@/models/TableColumn";
import { SalesForecast, SalesForecastStatusLabel } from "@/types/sales-forecast.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import Header from "@/components/Header";

export default function Page() {
  const [data, setData] = useState<SalesForecast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sales-forecasts");
        const json = await response.json();
        setData(json?.data ?? json ?? []);
      } catch (err) {
        console.error("Erro ao buscar dados de previsões de venda:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();

  const columns = [
    { header: "ID", accessorKey: "id", sortable: true },
    {
      header: "Cliente",
      accessorKey: "customer.name",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => (row.original as SalesForecast).customer?.name ?? "-"
    },
    {
      header: "Produto",
      accessorKey: "product.name",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => (row.original as SalesForecast).product?.name ?? "-"
    },
    { header: "Quantidade", accessorKey: "quantity", sortable: true },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const sf = row.original as SalesForecast;
        return SalesForecastStatusLabel[sf.status as keyof typeof SalesForecastStatusLabel] || String(sf.status);
      }
    },
    {
      header: "Motivo",
      accessorKey: "reason",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => (row.original as SalesForecast).reason ?? "-"
    },
    {
      header: "Próx. data estimada",
      accessorKey: "next_estimated_date",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const date = (row.original as SalesForecast).next_estimated_date;
        return date ? new Date(date).toLocaleDateString("pt-BR") : "-";
      }
    },
    {
      header: "Frequência (dias)",
      accessorKey: "frequency_days",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => (row.original as SalesForecast).frequency_days ?? "-"
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const sf = row.original as SalesForecast;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ver mais</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/production/sales-forecast/${sf.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal
                  typeModal="EDIT"
                  typeRegister="SalesForecast"
                  nameModal="previsão de venda"
                  rowData={sf}
                  idRowData={sf.id}
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal
                  typeModal="DELETE"
                  typeRegister="SalesForecast"
                  nameModal="previsão de venda"
                  idRowData={sf.id}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const arrayFilterFieldsByAcessorKey = columns.reduce((acc: TableColumn<DataRow>[], column) => {
    if ((column as any).accessorKey && (column as any).header) {
      acc.push({ header: (column as any).header, accessorKey: (column as any).accessorKey });
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
          <Header title="Previsão de venda" />
          <DynamicTable
            isLoadingSpinner={isLoading}
            columns={columns as any}
            data={data as any}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="SalesForecast"
          />
        </main>
      </div>
    </>
  );
}
