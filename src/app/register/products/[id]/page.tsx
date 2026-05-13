"use client";

import React, { useEffect, useState } from "react";

import Aside from "@/components/Aside";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import DataList from "@/components/DataList";
import Modal from "@/components/Modal/Modal";
import { Product, PRODUCT_TYPE_LABELS } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getProductLabel, getProductSku } from "@/utils/product-label";

export default function Page({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product>();

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();
      setProduct(data);
    };

    fetchProducts();
  }, [params.id]);

  return (
    <div className="page-layout">
      <nav className="aside-layout">
        <Aside />
      </nav>
      <main className="main-layout">
        <div className="grid px-20 pb-4 gap-4">
          <Header title="Informações do Produto" backTo="/register/products" />
          {product && (
            <div>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      {getProductLabel(product)}
                    </CardTitle>
                    <CardDescription>
                      <div className="text-xs text-muted-foreground">SKU: {getProductSku(product)}</div>
                      <div className="text-xs text-muted-foreground">
                        Data de registro: {new Date(product.created_at).toLocaleString()}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline" className="h-8 w-8">
                          <MoreVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">Mais</span>
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
                            typeRegister="Product"
                            nameModal="produto"
                            rowData={product}
                            idRowData={product.id}
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
                            rowData={product}
                            idRowData={product.id}
                            onDelete={() => router.push("/register/products")}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Atributos</div>
                    <DataList
                      items={[
                        { title: "Identificador", data: product.id.toString() },
                        { title: "SKU", data: getProductSku(product) },
                        { title: "Tipo", data: PRODUCT_TYPE_LABELS[product.type] ?? product.type },
                        { title: "Cor interna", data: product.inner_color?.name ?? "—" },
                        { title: "Espuma", data: product.foam?.name ?? "—" },
                        { title: "Cor externa", data: product.outer_color?.name ?? "—" },
                        { title: "Molde", data: product.mold?.name ?? "—" },
                        { title: "Status", data: String(product.status) }
                      ]}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Última atualização:{" "}
                    <time dateTime={new Date(product.updated_at).toString()}>
                      {new Date(product.updated_at).toLocaleString()}
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
