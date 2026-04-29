"use client";
import { useState, useEffect } from "react";

import "./Users.css";
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
import type { User } from "@/types/user.types";

export default function Page() {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/users");
        console.log(resp);
        setData(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();

  const columns: ColumnDef<User>[] = [
    {
      header: "ID",
      accessorKey: "id"
    },
    {
      header: "Nome",
      accessorKey: "name"
    },
    {
      header: "Email",
      accessorKey: "email"
    },
    {
      header: "Admin",
      accessorKey: "isAdmin",
      cell: ({ row }: { row: Row<User> }) => <span>{row.original.isAdmin ? "Sim" : "Não"}</span>
    },
    {
      header: "Data de criação",
      accessorKey: "created_at"
    },
    {
      header: "Última atualização",
      accessorKey: "updated_at"
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<User> }) => {
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
                onClick={() => router.push(`/control/users/${row.original.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes do usuário
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal
                  typeModal="EDIT"
                  typeRegister="User"
                  nameModal="usuário"
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
                <Modal typeModal="DELETE" typeRegister="User" nameModal="usuário" idRowData={row.original.id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const arrayFilterFieldsByAcessorKey = columns.reduce((acc: TableColumn<User>[], column) => {
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
          <Header title="Usuários da sistema" />
          <DynamicTable<User>
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="User"
          />
        </main>
      </div>
    </>
  );
}
