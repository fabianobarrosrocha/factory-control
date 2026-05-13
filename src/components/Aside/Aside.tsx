"use client";
import React from "react";

import "./Aside.css";
import {
  menuItensCadastro,
  menuItensControle,
  menuItensFuncionarios,
  menuItensGastos,
  menuItensProducao,
  menuItensRecebimento
} from "./MenuItens";
import { signOut, useSession } from "next-auth/react";
import LogoPontalti from "../LogoPontalti/LogoPontalti";
import MenuHoverButton from "@/components/MenuHoverButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, FileCog, Inbox, Package2, SquarePlus, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const Aside: React.FC = () => {
  const session = useSession();
  const isAdmin = session.data?.user?.access_level === "administrator";

  return (
    <div className="h-screen p-5">
      <div className="h-full py-5 rounded-lg flex flex-col items-center gap-4 bg-white">
        <div className="w-full ml-10 flex flex-row items-center justify-items-start gap-3">
          <LogoPontalti />
          <h1 className="font-bold tracking-wide uppercase antialiased">pontalti</h1>
        </div>
        <div className="flex flex-wrap items-center">
          <p className="text-xs font-bold text-[#64748b] ml-5 my-2 sm:max-2xl:mx-auto">MENU</p>
          <MenuHoverButton name={"Cadastro"} menuItens={menuItensCadastro}>
            <SquarePlus color="#64748b" />
          </MenuHoverButton>
          <MenuHoverButton name={"Recebimento"} menuItens={menuItensRecebimento}>
            <Inbox color="#64748b" />
          </MenuHoverButton>
          <MenuHoverButton name={isAdmin ? "Funcionarios" : "Horas e Ferias"} menuItens={menuItensFuncionarios}>
            <Users color="#64748b" />
          </MenuHoverButton>
          <MenuHoverButton name={"Controle"} menuItens={menuItensControle}>
            <FileCog color="#64748b" />
          </MenuHoverButton>
          <MenuHoverButton name={"Producão"} menuItens={menuItensProducao}>
            <Package2 color="#64748b" />
          </MenuHoverButton>
          <MenuHoverButton name={"Gastos"} menuItens={menuItensGastos}>
            <DollarSign color="#64748b" />
          </MenuHoverButton>
        </div>
        <div className="flex flex-row gap-3 mt-auto mb-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>PA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            {session ? (
              <>
                <p className="font-semibold tracking-wide antialiased text-sm">{session.data?.user.name}</p>
                <p className="font-semibold tracking-wide antialiased text-sm text-slate-400">
                  {session.data?.user.email}
                </p>
              </>
            ) : (
              <>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </>
            )}
          </div>
        </div>
        <Button className="w-3/4" variant="outline" onClick={() => signOut()}>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Aside;
