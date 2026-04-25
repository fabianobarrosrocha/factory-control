"use client";
import React from "react";

import { TimeConfigTable } from "./TimeConfigTable";

import Aside from "@/components/Aside";
import Header from "@/components/Header";

import { useSession } from "next-auth/react";

function Page() {
  const { data: session, status } = useSession();
  if (status === "authenticated") {
    return (
      <div className="page-layout">
        <nav className="aside-layout">
          <Aside />
        </nav>
        <main className="main-layout">
          <Header title="Horarios Padrao" />

          {session.user.isAdmin && <TimeConfigTable />}
        </main>
      </div>
    );
  }
}

export default Page;
