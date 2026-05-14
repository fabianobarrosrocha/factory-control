"use client";
import { useState, useEffect } from "react";

import axios from "axios";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { Row, ColumnDef } from "@tanstack/react-table";
import Modal from "@/components/Modal/Modal";
import { MoreHorizontal } from "lucide-react";
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
import type { Price } from "@/types/price.types";
import { getProductFullLabel } from "@/utils/product-label";

export default function Page() {
  const [data, setData] = useState<Price[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/prices");
        console.log(resp);
        setData(resp.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();

  const columns: ColumnDef<Price>[] = [
    {
      header: "ID",
      accessorKey: "id"
    },
    {
      header: "Produto",
      accessorKey: "product",
      cell: ({ row }: { row: Row<Price> }) => (
        <span>{row.original.product ? getProductFullLabel(row.original.product as any) : "-"}</span>
      )
    },
    {
      header: "Custo de Produção",
      accessorKey: "production_cost",
      cell: ({ row }: { row: Row<Price> }) => (
        <span>R$ {row.original.production_cost.toFixed(2)}</span>
      )
    },
    {
      header: "Margem Operacional",
      accessorKey: "operational_margin",
      cell: ({ row }: { row: Row<Price> }) => (
        <span>{row.original.operational_margin.toFixed(2)}%</span>
      )
    },
    {
      header: "Preço Final",
      accessorKey: "final_price",
      cell: ({ row }: { row: Row<Price> }) => (
        <span>R$ {row.original.final_price.toFixed(2)}</span>
      )
    },
    {
      header: "Preço Segunda Linha",
      accessorKey: "second_line_price",
      cell: ({ row }: { row: Row<Price> }) => (
        <span>{row.original.second_line_price ? `R$ ${row.original.second_line_price.toFixed(2)}` : '-'}</span>
      )
    },
    {
      header: "Congelado até",
      accessorKey: "frozen_until",
      cell: ({ row }: { row: Row<Price> }) => (
        <span>{row.original.frozen_until ? new Date(row.original.frozen_until).toLocaleDateString() : '-'}</span>
      )
    },
    {
      header: "Status",
      accessorKey: "status"
    },
    {
      header: "Última atualização",
      accessorKey: "last_update",
      cell: ({ row }: { row: Row<Price> }) => (
        <span>{new Date(row.original.last_update).toLocaleDateString()}</span>
      )
    },
    {
      header: "Data de criação",
      accessorKey: "created_at",
      cell: ({ row }: { row: Row<Price> }) => (
        <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
      )
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Price> }) => {
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
                onClick={() => router.push(`/control/prices/${row.original.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes do preço
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal typeModal="EDIT" typeRegister="Price" nameModal="preço" rowData={row.original} idRowData={row.original.id} />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal typeModal="DELETE" typeRegister="Price" nameModal="preço" idRowData={row.original.id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const arrayFilterFieldsByAcessorKey = columns.reduce((acc: TableColumn<Price>[], column) => {
    if ('accessorKey' in column && column.accessorKey && 'header' in column && column.header) {
      acc.push({ header: String(column.header), accessorKey: String(column.accessorKey) });
    }
    return acc;
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fullscreen-spinner">
          <Spinner visible={true} color="default" message="Loading Page..."/>
        </div>
      )}
      <div className="page-layout">
        <nav className="aside-layout">
          <Aside />
        </nav>
        <main className="main-layout">
          <Header title="Preços" />
          <DynamicTable<Price>
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="Price"
          />
        </main>
      </div>
    </>
  );
}
