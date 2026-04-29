"use client";
import { useState, useEffect } from "react";

import "./Machines.css";
import axios from "axios";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import Modal from "@/components/Modal/Modal";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Machine } from "@/types/machine.types";
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
  const router = useRouter();
  const [data, setData] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/machines");
        setData(resp.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      sortable: true
    },
    {
      header: "Modelo",
      accessorKey: "model",
      sortable: true
    },
    {
      header: "Número da máquina",
      accessorKey: "machine_number",
      sortable: true
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true
    },
    {
      header: "Localização",
      accessorKey: "location",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const location = row.original.location as { code?: string; name?: string } | null;
        return location ? `${location.code} - ${location.name}` : "-";
      }
    },
    {
      header: "Status da localização",
      accessorKey: "location_status",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const machine = row.original as Machine;
        // Se tiver location com status, usa o status da location
        if (machine.location?.status) {
          const locStatus = machine.location.status;
          if (typeof locStatus === "string") return locStatus;
          if (locStatus === 0) return "Suspenso";
          if (locStatus === 1) return "Operacional";
          return String(locStatus);
        }
        // Fallback para location_status
        const status = machine.location_status;
        if (status === "Operacional" || status === "Suspenso") {
          return status;
        }
        // Converte número para texto (enum: 0=Suspenso, 1=Operacional)
        if (status === 0 || status === "0") return "Suspenso";
        if (status === 1 || status === "1") return "Operacional";
        return status !== undefined && status !== null ? String(status) : "-";
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<DataRow> }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ver mais</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/register/machines/${row.original.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes da máquina
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal
                  typeModal="EDIT"
                  typeRegister="Machine"
                  nameModal="máquina"
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
                <Modal
                  typeModal="DELETE"
                  typeRegister="Machine"
                  nameModal="máquina"
                  rowData={row.original}
                  idRowData={row.original.id}
                />
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
          <Spinner visible={true} color="default" message="Loading Page..." />
        </div>
      )}
      <div className="page-layout">
        <nav className="aside-layout">
          <Aside />
        </nav>
        <main className="main-layout">
          <Header title="Máquinas" />
          <DynamicTable
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="Machine"
          />
        </main>
      </div>
    </>
  );
}
