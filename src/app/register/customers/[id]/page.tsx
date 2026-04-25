"use client";

import React, { useEffect, useState } from "react";

import VMasker from "vanilla-masker";
import Aside from "@/components/Aside";
import Header from "@/components/Header";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import DataList from "@/components/DataList";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer.types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function Page({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer>();

  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch(`/api/customers/${params.id}`);
      const data = await response.json();
      setCustomer(data);
    };

    fetchCustomers();
  }, [params.id]);

  return (
    <div className="page-layout">
      <nav className="aside-layout">
        <Aside />
      </nav>
      <main className="main-layout">
        <div className="grid px-20 pb-4 gap-4">
          <Header title="Informações do Cliente" backTo="/register/customers" />
          {customer && (
            <div>
              <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">{customer.name}</CardTitle>
                    <CardDescription>
                      <div className="text-xs text-muted-foreground">
                        Data de registro: {new Date(customer.created_at).toLocaleString()}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline" className="h-8 w-8">
                          <MoreVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onSelect={(event) => event.preventDefault()}
                          onPointerLeave={(event) => event.preventDefault()}
                          onPointerMove={(event) => event.preventDefault()}
                        >
                          <Modal
                            typeModal="EDIT"
                            typeRegister="Customer"
                            nameModal="cliente"
                            rowData={customer}
                            idRowData={customer.id}
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
                            typeRegister="Customer"
                            nameModal="cliente"
                            rowData={customer}
                            idRowData={customer.id}
                            onDelete={() => {
                              router.push("/register/customers");
                            }}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Informações gerais</div>
                    {customer && (
                      <DataList
                        items={[
                          {
                            title: "Identificador",
                            data: customer.id.toString()
                          },
                          { title: "Nome", data: customer.name },
                          {
                            title: "Email",
                            data: customer.email ?? "Não informado"
                          },
                          {
                            title: "Telefone Fixo",
                            data: customer.phone ? VMasker.toPattern(customer.phone, "(99) 9999-9999") : "Não informado"
                          },
                          {
                            title: "Telefone Celular",
                            data: customer.cel_number
                              ? VMasker.toPattern(customer.cel_number, "(99) 99999-9999")
                              : "Não informado"
                          },
                          {
                            title: "CPF",
                            data: customer.cpf ? VMasker.toPattern(customer.cpf, "999.999.999-99") : "Não informado"
                          },
                          {
                            title: "CNPJ",
                            data: customer.cnpj
                              ? VMasker.toPattern(customer.cnpj, "99.999.999/0001-99")
                              : "Não informado"
                          }
                        ]}
                      />
                    )}
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Detalhes de crédito</div>
                    {customer && (
                      <DataList
                        items={[
                          {
                            title: "Limite de Crédito",
                            data: `R$ ${customer.credit_limit}`
                          },
                          { title: "Debitos", data: `R$ ${customer.debts}` }
                        ]}
                      />
                    )}
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <div className="font-semibold">Endereço</div>
                      <address className="grid gap-0.5 not-italic text-muted-foreground">
                        <span>{customer.address.neighborhood}</span>
                        <span>
                          {customer.address.address_number} {customer.address.public_place}
                        </span>
                        <span>
                          {customer.address.city}, {customer.address.state}{" "}
                          {VMasker.toPattern(customer.address.zip_code, "99999-999")}
                        </span>
                      </address>
                    </div>
                    <div className="grid auto-rows-max gap-3">
                      <div className="font-semibold">Complemento</div>
                      <div className="text-muted-foreground">{customer.address.complement}</div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Outras informações</div>
                    {customer && (
                      <DataList
                        items={[
                          {
                            title: "Entrega?",
                            data: customer.deliver ? "Sim" : "Não"
                          },
                          {
                            title: "Pontalti?",
                            data: customer.pontalti ? "Sim" : "Não"
                          },
                          {
                            title: "Segunda Linha?",
                            data: customer.secondary_line ? "Sim" : "Não"
                          },
                          { title: "Status", data: customer.status }
                        ]}
                      />
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Última atualização:{" "}
                    <time dateTime={new Date(customer.updated_at).toString()}>
                      {new Date(customer.updated_at).toLocaleString()}
                    </time>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
