"use client";

import React, { useState } from "react";

import "./DynamicTable.css";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Spinner } from "@nextui-org/react";
import Modal from "@/components/Modal/Modal";
import { getTypeRegisterTranslation } from "@/config/type-register-translations";
import { Vendor } from "@/types/vendor.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Machine } from "@/types/machine.types";
import { Product } from "@/types/product.types";
import { Customer } from "@/types/customer.types";
import { Employee } from "@/types/employee.types";
import { Procedure } from "@/types/procedure.types";
import { PurchaseForecastSummary, MaterialForecast, ProductionControlForecast } from "@/types/purchase-forecast.types";
import { Expense } from "@/types/expense.types";
import { DataRow, TableColumn } from "@/models/TableColumn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

interface TableProps<T extends DataRow> {
  columns: ColumnDef<T>[];
  // data: T[];
  data:
    | Partial<Customer>[]
    | Partial<Employee>[]
    | Partial<Machine>[]
    | Partial<Procedure>[]
    | Partial<Product>[]
    | Partial<Vendor>[]
    | Partial<PurchaseForecastSummary>[]
    | Partial<MaterialForecast>[]
    | Partial<ProductionControlForecast>[]
    | Partial<Expense>[]
    | Partial<DataRow>[];
  filterFields?: TableColumn<T>[];
  typeRegister?: string;
  isLoadingSpinner?: boolean;
  onRowClick?: (rowData: any, rowIndex: number) => void;
}

function DynamicTable<T extends DataRow>({ columns, data, isLoadingSpinner, filterFields = [], typeRegister, onRowClick }: TableProps<T>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Garantir que data seja sempre um array
  const safeData = data || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = useReactTable({
    data: safeData as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: columns as any,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  const rows = table.getRowModel()?.rows || [];

  const renderTableBody = () => {
    if (isLoadingSpinner) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            <Spinner color="default" />
          </TableCell>
        </TableRow>
      );
    }

    if (!rows || rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Sem resultados.
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((row, index) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className={`${row.getValue("status") === "Suspenso" ? "bg-red-100" : ""} ${onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}`}
        onClick={() => onRowClick && onRowClick(row.original, index)}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className={typeRegister ? "w-full p-4" : "w-full"}>
      {typeRegister && (
        <div className="flex items-center py-4 gap-4 flex-wrap">
          {filterFields && filterFields.length > 0 && (
            <div className="w-full grid grid-cols-4 gap-4">
              {filterFields.map((filterField, index) => (
                <div key={index}>
                  <Input
                    type="text"
                    name={filterField.accessorKey}
                    placeholder={"Filtrar " + filterField.header?.toLocaleLowerCase() + "..."}
                    value={(table.getColumn(filterField.accessorKey || "")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                      table.getColumn(filterField.accessorKey || "")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="w-1/2 flex justify-between">
            <Modal typeModal="CREATE" nameModal={getTypeRegisterTranslation(typeRegister)} typeRegister={typeRegister} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="px-3">
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {String(column.columnDef.header)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                    >
                      <div className="flex items-center space-x-2">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {renderTableBody()}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DynamicTable;
