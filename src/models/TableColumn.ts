import { Row } from "@tanstack/react-table";
import { Customer } from "@/types/customer.types";
import { Employee } from "@/types/employee.types";
import { Machine } from "@/types/machine.types";
import { Procedure } from "@/types/procedure.types";
import { Product } from "@/types/product.types";
import { Vendor } from "@/types/vendor.types";
import { Vacation } from "@/types/vacation.types";
import { TimeConfiguration } from "@/types/time-configuration.types";
import { Schedule } from "@/types/schedule.types";
import { User } from "@/types/user.types";
import { Invoice } from "@/types/invoice.types";
import { Packaging } from "@/types/packaging.types";
import { Delivery } from "@/types/delivery.types";
import { Stock } from "@/types/stock.types";
import { ProductionControl } from "@/types/production-control.types";
import { SalesForecast } from "@/types/sales-forecast.types";
import { LabelPrint } from "@/types/label-print.types";
import { PurchaseForecastSummary, MaterialForecast, ProductionControlForecast } from "@/types/purchase-forecast.types";
import { Expense } from "@/types/expense.types";
import { ProductReturn } from "@/types/product_return.types";
import { Color } from "@/types/color.types";
import { Foam } from "@/types/foam.types";
import { Mold } from "@/types/mold.types";

export type DataRow =
  | Customer
  | Employee
  | Machine
  | Procedure
  | Product
  | Vendor
  | Vacation
  | TimeConfiguration
  | Schedule
  | User
  | Invoice
  | Packaging
  | Delivery
  | Stock
  | ProductionControl
  | SalesForecast
  | LabelPrint
  | PurchaseForecastSummary
  | MaterialForecast
  | ProductionControlForecast
  | Expense
  | ProductReturn
  | Color
  | Foam
  | Mold;

export type TableColumn<T> = {
  id?: string;
  cell?: ({ row }: { row: Row<T> }) => JSX.Element;
  enableHiding?: boolean;
  header?: string;
  accessorKey?: string;
};
