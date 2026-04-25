"use client";
import { useState, useEffect } from "react";

import "./Employees.css";
import axios from "axios";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import Modal from "@/components/Modal/Modal";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employee.types";
import DynamicTable from "@/components/DynamicTable";
import { DataRow, TableColumn } from "@/models/TableColumn";
import { formatCellPhone, formatCpf, formatPhone } from "@/utils/formatters";
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
  const [data, setData] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/employees");
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
      header: "Cpf",
      accessorKey: "cpf",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{formatCpf((row.original as Employee).cpf)}</span>
    },
    {
      header: "Num. telefone",
      accessorKey: "phone",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{formatPhone((row.original as Employee).phone)}</span>
    },
    {
      header: "Num. celular",
      accessorKey: "cel_number",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => <span>{formatCellPhone((row.original as Employee).cel_number)}</span>
    },
    {
      header: "Salário",
      accessorKey: "salary",
      sortable: true
    },
    {
      header: "Admissão",
      accessorKey: "admission",
      sortable: true,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const date = new Date(row.getValue("admission"));
        return (
          <>
            {date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </>
        );
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<DataRow> }) => {
        const employee = row.original as Employee;

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
                onClick={() => router.push(`/register/employees/${employee.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes do funcionário
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal
                  typeModal="EDIT"
                  typeRegister="Employee"
                  nameModal="funcionario"
                  rowData={employee}
                  idRowData={employee.id}
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
                  typeRegister="Employee"
                  nameModal="funcionario"
                  rowData={employee}
                  idRowData={employee.id}
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
          <Header title="Funcionários" />
          <DynamicTable
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="Employee"
          />
        </main>
      </div>
    </>
  );
}
