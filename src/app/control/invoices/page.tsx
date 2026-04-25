"use client";
import { useState, useEffect } from "react";

import "./Invoices.css";
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
import type { Invoice } from "@/types/invoice.types";

export default function Page() {
  const [data, setData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/invoices");
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

  const columns: ColumnDef<Invoice>[] = [
    {
      header: "Número",
      accessorKey: "number"
    },
    {
      header: "Status",
      accessorKey: "status"
    },
    {
      header: "Tipo",
      accessorKey: "type"
    },
    {
      header: "Data de Emissão",
      accessorKey: "issue_date",
      cell: ({ row }: { row: Row<Invoice> }) => <span>{new Date(row.original.issue_date).toLocaleDateString()}</span>
    },
    {
      header: "Destinatário",
      accessorKey: "recipient"
    },
    {
      header: "Pedido",
      accessorKey: "order_id",
      cell: ({ row }: { row: Row<Invoice> }) => <span>#{row.original.order_id}</span>
    },
    {
      header: "Valor",
      accessorKey: "order.final_price",
      cell: ({ row }: { row: Row<Invoice> }) => <span>R$ {row.original.order.final_price.toFixed(2)}</span>
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Invoice> }) => {
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
                onClick={() => router.push(`/control/invoices/${row.original.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes da nota fiscal
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal
                  typeModal="EDIT"
                  typeRegister="Invoice"
                  nameModal="nota fiscal"
                  rowData={row.original}
                  idRowData={row.original.id}
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal typeModal="DELETE" typeRegister="Invoice" nameModal="nota fiscal" idRowData={row.original.id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const arrayFilterFieldsByAcessorKey = columns.reduce((acc: TableColumn<Invoice>[], column) => {
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
          <Header title="Emissão Nota Fiscal" />
          <DynamicTable<Invoice>
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="Invoice"
          />
        </main>
      </div>
    </>
  );
}
