"use client";
import { useState, useEffect } from "react";

import "./Vendors.css";
import axios from "axios";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import Modal from "@/components/Modal/Modal";
import { MoreHorizontal } from "lucide-react";
import { Vendor } from "@/types/vendor.types";
import { Button } from "@/components/ui/button";
import DynamicTable from "@/components/DynamicTable";
import { DataRow, TableColumn } from "@/models/TableColumn";
import { formatCellPhone, formatCnpj, formatPhone } from "@/utils/formatters";
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
  const [data, setData] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/vendors");
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
      header: "Nome",
      accessorKey: "name",
      sortable: true
    },
    {
      header: "Nome da loja",
      accessorKey: "store_name",
      sortable: true
    },
    {
      header: "Num. telefone",
      accessorKey: "phone",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{formatPhone((row.original as Vendor).phone)}</span>
    },
    {
      header: "Num. celular",
      accessorKey: "cel_number",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{formatCellPhone((row.original as Vendor).cel_number)}</span>
    },
    {
      header: "Cnpj",
      accessorKey: "cnpj",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{formatCnpj((row.original as Vendor).cnpj)}</span>
    },
    {
      header: "Entrega",
      accessorKey: "deliver",
      sortable: true
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const vendor = row.original as Vendor;

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
                onClick={() => router.push(`/register/vendors/${vendor.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes do fornecedor
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal
                  typeModal="EDIT"
                  typeRegister="Vendor"
                  nameModal="fornecedor"
                  rowData={vendor}
                  idRowData={vendor.id}
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
                  typeRegister="Vendor"
                  nameModal="fornecedor"
                  rowData={vendor}
                  idRowData={vendor.id}
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
          <Header title="Fornecedores" />
          <DynamicTable
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="Vendor"
          />
        </main>
      </div>
    </>
  );
}
