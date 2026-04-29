"use client";
import { useState, useEffect } from "react";

import "./Delivery.css";
import axios from "axios";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import Modal from "@/components/Modal/Modal";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Delivery, DeliveryStatusLabel } from "@/types/delivery.types";
import DynamicTable from "@/components/DynamicTable";
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
  const [data, setData] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/delivery");
        setData(resp.data.data || []);
      } catch (err) {
        console.error("Erro ao buscar dados de entregas:", err);
        setData([]); // Garantir que data seja sempre um array
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      sortable: true,
    },
    {
      header: "ID do Pedido",
      accessorKey: "order_id",
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const delivery = row.original as Delivery;
        return DeliveryStatusLabel[delivery.status as keyof typeof DeliveryStatusLabel] || delivery.status;
      }
    },
    {
      header: "Data de Entrega",
      accessorKey: "delivery_date",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const delivery = row.original as Delivery;
        const date = new Date(delivery.delivery_date);
        return date.toLocaleDateString('pt-BR');
      }
    },
    {
      header: "Data de Criação",
      accessorKey: "created_at",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const delivery = row.original as Delivery;
        const date = new Date(delivery.created_at);
        return date.toLocaleDateString('pt-BR');
      }
    },
    {
      header: "Data de Atualização",
      accessorKey: "updated_at",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const delivery = row.original as Delivery;
        const date = new Date(delivery.updated_at);
        return date.toLocaleDateString('pt-BR');
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const delivery = row.original as Delivery;
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
                onClick={() => router.push(`/production/delivery/${delivery.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes da entrega
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal typeModal="EDIT" typeRegister="Delivery" nameModal="entrega" rowData={delivery} idRowData={delivery.id} />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal typeModal="DELETE" typeRegister="Delivery" nameModal="entrega" idRowData={delivery.id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const arrayFilterFieldsByAcessorKey = columns.reduce((acc: TableColumn<DataRow>[], column) => {
    if (column.accessorKey && column.header) {
      acc.push({ header: column.header, accessorKey: column.accessorKey });
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
          <Header title="Entregas" />
          <DynamicTable
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="Delivery"
          />
        </main>
      </div>
    </>
  );
} 