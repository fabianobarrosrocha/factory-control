"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Reset: React.FC = () => {
  return (
    <div className="max-w-screen bg-white min-h-screen flex items-center justify-center">
      <div className="w-1/4 flex flex-col gap-5 rounded border border-[#e2e8f0] p-7 shadow-md">
        <div className="w-full flex items-center justify-center">
          <Image src="/images/logo_pontalti_default.png" width={45} height={45} alt="Logo Pontalti" />
        </div>
        <Separator />
        <h1 className="text-lg font-semibold text-center">Recuperação de Senha</h1>
        <p className="text-sm text-muted-foreground text-center">
          Para redefinir sua senha, entre em contato com o administrador do sistema.
        </p>
        <Link href="/auth/login" className="w-full">
          <Button className="w-full" variant="outline">
            Voltar ao Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Reset;
