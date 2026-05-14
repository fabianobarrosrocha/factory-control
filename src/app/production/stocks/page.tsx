"use client";

import { useState, useEffect } from "react";

import "./Stocks.css";
import axios from "axios";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import Modal from "@/components/Modal/Modal";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stock } from "@/types/stock.types";
import DynamicTable from "@/components/DynamicTable";
import { getProductFullLabel } from "@/utils/product-label";
import { DataRow, TableColumn } from "@/models/TableColumn";
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
  const [data, setData] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/stocks");
        setData(resp.data.data || []);
      } catch (err) {
        console.error("Erro ao buscar dados de estoques:", err);
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
    { header: "Quantidade", accessorKey: "amount", sortable: true },
    {
      header: "Localização",
      accessorKey: "location",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const stock = row.original as Stock;
        return stock.location ? `${stock.location.code} - ${stock.location.name}` : "-";
      }
    },
    {
      header: "Produto",
      accessorKey: "product",
      sortable: false,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const stock = row.original as Stock;
        return stock.product ? getProductFullLabel(stock.product as any) : "-";
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const stock = row.original as Stock;
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
                onClick={() => router.push(`/production/stocks/${stock.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes do estoque
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal typeModal="EDIT" typeRegister="Stock" nameModal="estoque" rowData={stock} idRowData={stock.id} />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal typeModal="DELETE" typeRegister="Stock" nameModal="estoque" idRowData={stock.id} />
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
          <Header title="Estoque" />
          <DynamicTable
            isLoadingSpinner={isLoading}
            columns={columns as any}
            data={data as any}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="Stock"
          />
        </main>
      </div>
    </>
  );
}
