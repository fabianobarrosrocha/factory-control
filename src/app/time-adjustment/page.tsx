"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import Aside from "@/components/Aside";
import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeAdjustmentRequest } from "@/types/time-adjustment-request.types";
import { MyAdjustmentRequests } from "./components/MyAdjustmentRequests";
import { AdminPendingRequestsTable } from "../timedashboard/components/AdminPendingRequestsTable";

import { useSession } from "next-auth/react";

function Page() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [myRequests, setMyRequests] = useState<TimeAdjustmentRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<TimeAdjustmentRequest[]>([]);
  const [allRequests, setAllRequests] = useState<TimeAdjustmentRequest[]>([]);

  const isAdmin = session?.user?.access_level === "administrator";
  const employeeId = session?.user?.idToken;

  const fetchMyRequests = useCallback(async () => {
    if (!employeeId) return;
    try {
      const response = await axios.get(`/api/time-adjustment-requests/employee/${employeeId}`);
      setMyRequests(response.data);
    } catch (error) {
      console.error("Error fetching my requests:", error);
    }
  }, [employeeId]);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await axios.get("/api/time-adjustment-requests/pending");
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  }, []);

  const fetchAllRequests = useCallback(async () => {
    try {
      const response = await axios.get("/api/time-adjustment-requests");
      setAllRequests(response.data);
    } catch (error) {
      console.error("Error fetching all requests:", error);
    }
  }, []);

  const handleRefreshAdmin = useCallback(() => {
    fetchPendingRequests();
    fetchAllRequests();
  }, [fetchPendingRequests, fetchAllRequests]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (isAdmin) {
          await Promise.all([fetchPendingRequests(), fetchAllRequests()]);
        } else {
          await fetchMyRequests();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadData();
    }
  }, [status, isAdmin, fetchMyRequests, fetchPendingRequests, fetchAllRequests]);

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="page-layout">
      <nav className="aside-layout">
        <Aside />
      </nav>
      <main className="main-layout">
        <Header title="Ajuste de Horas" />
        {isLoading && (
          <div className="fullscreen-spinner">
            <Spinner visible={true} color="default" message="Carregando..." />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {isAdmin ? (
            <>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "pending" ? "default" : "outline"}
                  onClick={() => setActiveTab("pending")}
                >
                  Pendentes ({pendingRequests.length})
                </Button>
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                >
                  Todas as Solicitacoes
                </Button>
              </div>

              {activeTab === "pending" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Solicitacoes Pendentes</CardTitle>
                    <CardDescription>
                      Revise e aprove ou rejeite as solicitacoes de ajuste de ponto dos funcionarios.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminPendingRequestsTable
                      data={pendingRequests}
                      onRefresh={handleRefreshAdmin}
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Todas as Solicitacoes</CardTitle>
                    <CardDescription>
                      Historico completo de todas as solicitacoes de ajuste de ponto.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminPendingRequestsTable
                      data={allRequests}
                      onRefresh={handleRefreshAdmin}
                    />
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Minhas Solicitacoes de Ajuste</CardTitle>
                <CardDescription>
                  Acompanhe o status das suas solicitacoes de ajuste de ponto.
                  Para solicitar um novo ajuste, acesse a pagina &quot;Ponto Online&quot; e clique em &quot;Ver historico do dia&quot;.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MyAdjustmentRequests data={myRequests} onRefresh={fetchMyRequests} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default Page;
