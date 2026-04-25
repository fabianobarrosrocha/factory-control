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
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ProductReturn } from "@/types/product_return.types";

export default function Page({ params }: { params: { id: string } }) {
  const [productReturn, setProductReturn] = useState<ProductReturn>();

  const router = useRouter();

  useEffect(() => {
    const fetchProductReturns = async () => {
      const response = await fetch(`/api/product-returns/${params.id}`);
      const data = await response.json();
      setProductReturn(data);
    };

    fetchProductReturns();
  }, [params.id]);

  return (
    <div className="page-layout">
      <nav className="aside-layout">
        <Aside />
      </nav>
      <main className="main-layout">
        <div className="grid px-20 pb-4 gap-4">
          <Header title="Informações da Devolução" backTo="/receive/product-returns" />
          {productReturn && (
            <div>
              <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">{productReturn.id}</CardTitle>
                    <CardDescription>
                      <div className="text-xs text-muted-foreground">
                        Data de registro: {new Date(productReturn.created_at).toLocaleString()}
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
                        <DropdownMenuItem className="cursor-pointer" onSelect={(event) => event.preventDefault()}>
                          <Modal
                            typeModal="EDIT"
                            typeRegister="ProductReturn"
                            nameModal="pedido"
                            rowData={productReturn}
                            idRowData={productReturn.id}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onSelect={(event) => event.preventDefault()}>
                          <Modal
                            typeModal="DELETE"
                            typeRegister="ProductReturn"
                            nameModal="pedido"
                            rowData={productReturn}
                            idRowData={productReturn.id}
                            onDelete={() => {
                              router.push("/receive/product-returns");
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
                    {productReturn && (
                      <DataList
                        items={[
                          { title: "Identificador", data: productReturn.id.toString() },
                          { title: "Motivo da devolução", data: productReturn.return_reason.toString() },
                          { title: "Necessário substituição?", data: productReturn.replacement_necessary.toString() },
                          { title: "Revendido?", data: productReturn.resold.toString() },
                          { title: "Local de armazenamento", data: productReturn.storage_location },
                          { title: "ID do pedido", data: productReturn.order.id.toString() }
                        ]}
                      />
                    )}
                  </div>
                  <Separator className="my-4" />
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Última atualização:{" "}
                    <time dateTime={new Date(productReturn.updated_at).toString()}>
                      {new Date(productReturn.updated_at).toLocaleString()}
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
