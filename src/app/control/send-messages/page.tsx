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
import { MessageConfig } from "@/types/message.types";
import { MessageTriggerType } from "@/types/message.types";
import { MessageTargetTable } from "@/types/message.types";

export default function Page() {
  const [data, setData] = useState<MessageConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/messages/config");
        console.log(resp.data);
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

  const columns: ColumnDef<MessageConfig>[] = [
    {
      header: "ID",
      accessorKey: "id"
    },
    {
      header: "Cliente ID",
      accessorKey: "customer_id"
    },
    {
      header: "WhatsApp",
      accessorKey: "can_whatsapp",
      cell: ({ row }: { row: Row<MessageConfig> }) => <span>{row.original.can_whatsapp ? "Sim" : "Não"}</span>
    },
    {
      header: "Email",
      accessorKey: "can_email",
      cell: ({ row }: { row: Row<MessageConfig> }) => <span>{row.original.can_email ? "Sim" : "Não"}</span>
    },
    {
      header: "SMS",
      accessorKey: "can_sms",
      cell: ({ row }: { row: Row<MessageConfig> }) => <span>{row.original.can_sms ? "Sim" : "Não"}</span>
    },
    {
      header: "Tipo de Gatilho",
      accessorKey: "trigger_type",
      cell: ({ row }: { row: Row<MessageConfig> }) => {
        const triggerTypeMap = {
          [MessageTriggerType.SCHEDULED]: "Agendado",
          [MessageTriggerType.EVENT]: "Evento",
          [MessageTriggerType.MANUAL]: "Manual"
        };
        return <span>{triggerTypeMap[row.original.trigger_type]}</span>;
      }
    },
    {
      header: "Tabela Alvo",
      accessorKey: "target_table",
      cell: ({ row }: { row: Row<MessageConfig> }) => {
        const targetTableMap = {
          [MessageTargetTable.CUSTOMER]: "Cliente",
          [MessageTargetTable.ORDER]: "Pedido",
          [MessageTargetTable.PAYMENT]: "Pagamento",
          [MessageTargetTable.DELIVERY]: "Entrega"
        };
        return <span>{targetTableMap[row.original.target_table]}</span>;
      }
    },
    {
      header: "Ativo",
      accessorKey: "is_active",
      cell: ({ row }: { row: Row<MessageConfig> }) => <span>{row.original.is_active ? "Sim" : "Não"}</span>
    },
    {
      header: "Data de criação",
      accessorKey: "created_at",
      cell: ({ row }: { row: Row<MessageConfig> }) => (
        <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
      )
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<MessageConfig> }) => {
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
                onClick={() => router.push(`/control/send-messages/${row.original.id}`)}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                Ver detalhes da configuração
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                onPointerMove={(event) => event.preventDefault()}
              >
                <Modal
                  typeModal="EDIT"
                  typeRegister="MessageConfig"
                  nameModal="configuração"
                  rowData={row.original}
                  idRowData={Number(row.original.id)}
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
                  typeRegister="MessageConfig"
                  nameModal="configuração"
                  idRowData={Number(row.original.id)}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const arrayFilterFieldsByAcessorKey = columns.reduce((acc: TableColumn<MessageConfig>[], column) => {
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
          <Header title="Envio de Mensagens" />
          <DynamicTable<MessageConfig>
            isLoadingSpinner={isLoading}
            columns={columns}
            data={data}
            filterFields={arrayFilterFieldsByAcessorKey}
            typeRegister="MessageConfig"
          />
        </main>
      </div>
    </>
  );
}
