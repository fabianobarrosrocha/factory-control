"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Search, Calendar } from "lucide-react";

import Aside from "@/components/Aside";
import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useSession } from "next-auth/react";

type Employee = {
  id: number;
  name: string;
};

type WorkHourRecord = {
  id: number;
  employee_id: number;
  employee: Employee;
  clock_in: string;
  clock_out: string | null;
};

function Page() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workHours, setWorkHours] = useState<WorkHourRecord[]>([]);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

  const isAdmin = session?.user?.access_level === "administrator";

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get("/api/employees");
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, []);

  const fetchWorkHours = useCallback(async () => {
    if (!startDate || !endDate) return;

    setIsLoading(true);
    try {
      const params: any = {
        startDate,
        endDate,
      };

      if (selectedEmployee !== "all") {
        params.employee_id = selectedEmployee;
      }

      const response = await axios.get("/api/employees/work-hours/report", { params });
      setWorkHours(response.data);
    } catch (error) {
      console.error("Error fetching work hours:", error);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, selectedEmployee]);

  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      fetchEmployees();
    }
  }, [status, isAdmin, fetchEmployees]);

  const handleSearch = () => {
    fetchWorkHours();
  };

  const setToday = () => {
    const today = moment().format("YYYY-MM-DD");
    setStartDate(today);
    setEndDate(today);
  };

  const setThisWeek = () => {
    setStartDate(moment().startOf("week").format("YYYY-MM-DD"));
    setEndDate(moment().endOf("week").format("YYYY-MM-DD"));
  };

  const setThisMonth = () => {
    setStartDate(moment().startOf("month").format("YYYY-MM-DD"));
    setEndDate(moment().endOf("month").format("YYYY-MM-DD"));
  };

  if (status !== "authenticated") {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="page-layout">
        <nav className="aside-layout">
          <Aside />
        </nav>
        <main className="main-layout">
          <Header title="Relatorio de Pontos" />
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Acesso restrito a administradores.</p>
          </div>
        </main>
      </div>
    );
  }

  // Calcular totais
  const calculateTotalHours = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return "-";
    const start = moment(clockIn);
    const end = moment(clockOut);
    const duration = moment.duration(end.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="page-layout">
      <nav className="aside-layout">
        <Aside />
      </nav>
      <main className="main-layout">
        <Header title="Relatorio de Pontos" />

        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>
                Selecione o periodo e funcionario para visualizar os registros de ponto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-[160px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-[160px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Funcionario</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={setToday}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={setThisWeek}>
                  Esta Semana
                </Button>
                <Button variant="outline" size="sm" onClick={setThisMonth}>
                  Este Mes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registros de Ponto</CardTitle>
              <CardDescription>
                {workHours.length > 0
                  ? `${workHours.length} registro(s) encontrado(s)`
                  : "Utilize os filtros acima para buscar os registros"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner visible={true} color="default" message="Buscando..." />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Funcionario</TableHead>
                        <TableHead className="whitespace-nowrap">Data</TableHead>
                        <TableHead className="whitespace-nowrap">Entrada</TableHead>
                        <TableHead className="whitespace-nowrap">Saida</TableHead>
                        <TableHead className="whitespace-nowrap">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workHours.length > 0 ? (
                        workHours.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {record.employee?.name || `ID: ${record.employee_id}`}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {moment(record.clock_in).format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {moment(record.clock_in).format("HH:mm:ss")}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.clock_out
                                ? moment(record.clock_out).format("HH:mm:ss")
                                : "-"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {calculateTotalHours(record.clock_in, record.clock_out)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            Nenhum registro encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Page;
