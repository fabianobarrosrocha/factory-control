"use client";
import { useState, useEffect } from "react";

import "./Products.css";
import axios from "axios";
import Link from "next/link";
import Aside from "@/components/Aside";
import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import Modal from "@/components/Modal/Modal";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, PRODUCT_TYPE_LABELS } from "@/types/product.types";
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

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/products");
        setData(resp.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { header: "ID", accessorKey: "id", sortable: true },
    { header: "SKU", accessorKey: "sku", sortable: true },
    {
      header: "Tipo",
      accessorKey: "type",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const p = row.original as Product;
        return <span>{PRODUCT_TYPE_LABELS[p.type] ?? p.type}</span>;
      }
    },
    {
      header: "Cor interna",
      accessorKey: "inner_color",
      sortable: false,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{(row.original as Product).inner_color?.name ?? "—"}</span>
    },
    {
      header: "Espuma",
      accessorKey: "foam",
      sortable: false,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{(row.original as Product).foam?.name ?? "—"}</span>
    },
    {
      header: "Cor externa",
      accessorKey: "outer_color",
      sortable: false,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{(row.original as Product).outer_color?.name ?? "—"}</span>
    },
    {
      header: "Molde",
      accessorKey: "mold",
      sortable: false,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{(row.original as Product).mold?.name ?? "—"}</span>
    },
    { header: "Status", accessorKey: "status", sortable: true },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<DataRow> }) => {
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/register/products/${row.original.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes do produto
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal
                  typeModal="EDIT"
                  typeRegister="Product"
                  nameModal="produto"
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
                  typeRegister="Product"
                  nameModal="produto"
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
          <Spinner visible={true} color="default" message="Carregando..." />
        </div>
      )}
      <div className="page-layout">
        <nav className="aside-layout">
          <Aside />
        </nav>
        <main className="main-layout">
          <Header title="Produtos" />
          <div className="flex justify-end px-4 pt-2">
            <Link href="/register/products/generate">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Gerar variantes
              </Button>
            </Link>
          </div>
          <DynamicTable
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="Product"
          />
        </main>
      </div>
    </>
  );
}
