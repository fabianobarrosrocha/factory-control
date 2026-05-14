"use client";

import React, { useEffect, useState } from "react";

import Aside from "@/components/Aside";
import Header from "@/components/Header";
import { MoreVertical, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Stock } from "@/types/stock.types";
import { getProductFullLabel } from "@/utils/product-label";

export default function Page({ params }: { params: { id: string } }) {
  const [stock, setStock] = useState<Stock>();

  const router = useRouter();

  useEffect(() => {
    const fetchStock = async () => {
      const response = await fetch(`/api/stocks/${params.id}`);
      const data = await response.json();
      setStock(data);
    };

    fetchStock();
  }, [params.id]);

  return (
    <div className="page-layout">
      <nav className="aside-layout">
        <Aside />
      </nav>
      <main className="main-layout">
        <div className="grid px-20 pb-4 gap-4">
          <Header title="Informações do Estoque" backTo="/production/stocks" />
          {stock && (
            <div>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Estoque #{stock.id}
                    </CardTitle>
                    <CardDescription>
                      <div className="text-xs text-muted-foreground">
                        Produto: {stock.product ? getProductFullLabel(stock.product as any) : "—"}
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
                        <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                          <Modal typeModal="EDIT" typeRegister="Stock" nameModal="estoque" rowData={stock} idRowData={stock.id} />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                          <Modal
                            typeModal="DELETE"
                            typeRegister="Stock"
                            nameModal="estoque"
                            rowData={stock}
                            idRowData={stock.id}
                            onDelete={() => {
                              router.push("/production/stocks");
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
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Quantidade: {stock.amount}</div>
                      <div>Local: {stock.location?.name || "Não definido"}</div>
                      <div>Produto: {stock.product ? getProductFullLabel(stock.product as any) : "—"}</div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">ID: {stock.id}</div>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


