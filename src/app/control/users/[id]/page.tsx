"use client";

import React, { useEffect, useState } from "react";

import Aside from "@/components/Aside";
import Header from "@/components/Header";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import DataList from "@/components/DataList";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/ui/button";
import { type User, ACCESS_LEVEL_LABELS } from "@/types/user.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function Page({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User>();

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${params.id}`);
      const data = await response.json();
      setUser(data);
    };

    fetchUser();
  }, [params.id]);

  return (
    <div className="page-layout">
      <nav className="aside-layout">
        <Aside />
      </nav>
      <main className="main-layout">
        <div className="grid px-20 pb-4 gap-4">
          <Header title="Informações do Usuário" backTo="/control/users" />
          {user && (
            <div>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">{user.name}</CardTitle>
                    <CardDescription>
                      <div className="text-xs text-muted-foreground">
                        Data de registro: {new Date(user.created_at).toLocaleString()}
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
                            typeRegister="User"
                            nameModal="usuário"
                            rowData={user}
                            idRowData={user.id}
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
                            typeRegister="User"
                            nameModal="usuário"
                            rowData={user}
                            idRowData={user.id}
                            onDelete={() => {
                              router.push("/control/users");
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
                    <DataList
                      items={[
                        { title: "Identificador", data: user.id.toString() },
                        { title: "Nome", data: user.name },
                        { title: "Email", data: user.email },
                        { title: "Nível de Acesso", data: ACCESS_LEVEL_LABELS[user.access_level] ?? "—" }
                      ]}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Última atualização:{" "}
                    <time dateTime={new Date(user.updated_at).toString()}>
                      {new Date(user.updated_at).toLocaleString()}
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
