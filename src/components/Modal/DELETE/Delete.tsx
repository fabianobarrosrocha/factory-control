import React, { useState } from "react";

import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { Status } from "@/types/common.types";
import { Vendor } from "@/types/vendor.types";
import { Product } from "@/types/product.types";
import { Machine } from "@/types/machine.types";
import { Customer } from "@/types/customer.types";
import { Procedure } from "@/types/procedure.types";
import { Vacation } from "@/types/vacation.types";
import { Order } from "@/types/order.types";
import { TimeConfiguration } from "@/types/time-configuration.types";
import { MaterialOrder } from "@/types/material-order.types";
import { ProductReturnRegister } from "@/types/product_return.types";
import { PaymentRegister } from "@/types/payment.types";
import { User } from "@/types/user.types";
import { Price } from "@/types/price.types";
import { MessageConfig } from "@/types/message.types";
import { Packaging } from "@/types/packaging.types";
import { Delivery } from "@/types/delivery.types";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface ModalDeleteProps {
  nameModal: string;
  typeRegister: TypeRegister;
  idRowData?: number | string;
  onDelete?: () => void;
}

type TypeRegister = "Customer" | "Employee" | "Machine" | "Procedure" | "Product" | "Vendor" | "Vacation" | "TimeConfiguration" | "Order" | "MaterialOrder" | "ProductReturn" | "Payment" | "User" | "Price" | "MessageConfig" | "Invoice" | "Packaging" | "Delivery" | "DeliveryPackaging" | "CustomerPackaging" | "Stock" | "ProductionControl" | "SalesForecast" | "LabelPrint" | "Expense" | "Location" | "Color" | "Foam" | "Mold";

export const Delete = ({ nameModal, typeRegister, idRowData, onDelete }: ModalDeleteProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  let apiCallByType: string;

  switch (typeRegister) {
    case "Customer":
      apiCallByType = "customers";
      break;
    case "Employee":
      apiCallByType = "employees";
      break;
    case "Machine":
      apiCallByType = "machines";
      break;
    case "Procedure":
      apiCallByType = "procedures";
      break;
    case "Product":
      apiCallByType = "products";
      break;
    case "Vendor":
      apiCallByType = "vendors";
      break;
    case "Vacation":
      apiCallByType = "employees/vacations";
      break;
    case "TimeConfiguration":
      apiCallByType = "time-configurations";
      break;
    case "Order":
      apiCallByType = "orders";
      break;
    case "MaterialOrder":
      apiCallByType = "material-orders";
      break;
    case "ProductReturn":
      apiCallByType = "product-returns";
      break;
    case "Payment":
      apiCallByType = "payments";
      break;
    case "User":
      apiCallByType = "users";
      break;
    case "Price":
      apiCallByType = "prices";
      break;
    case "MessageConfig":
      apiCallByType = "messages/config";
      break;
    case "Invoice":
      apiCallByType = "invoices";
      break;
    case "Packaging":
      apiCallByType = "packaging";
      break;
    case "Delivery":
      apiCallByType = "delivery";
      break;
    case "DeliveryPackaging":
      apiCallByType = "delivery-packaging";
      break;
    case "CustomerPackaging":
      apiCallByType = "customer-packaging";
      break;
    case "Stock":
      apiCallByType = "stocks";
      break;
    case "ProductionControl":
      apiCallByType = "production-control";
      break;
    case "SalesForecast":
      apiCallByType = "sales-forecasts";
      break;
    case "LabelPrint":
      apiCallByType = "label-prints";
      break;
    case "Expense":
      apiCallByType = "expenses";
      break;
    case "Location":
      apiCallByType = "locations";
      break;
    case "Color":
      apiCallByType = "colors";
      break;
    case "Foam":
      apiCallByType = "foams";
      break;
    case "Mold":
      apiCallByType = "molds";
      break;
    default:
      throw new Error(`Invalid typeRegister: ${typeRegister}`);
  }

  async function deleteData() {
    setIsLoading(true);
    try {
      await axios.delete(`/api/${apiCallByType}/${idRowData}`);
      setIsLoading(false);
      setOpen(false);
      toast({
        title: "Excluir",
        description: `${nameModal} foi excluído com sucesso.`
      });
      if (onDelete) {
        onDelete();
      } else {
        // Reload page to refresh data since we use client-side fetching
        window.location.reload();
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error(error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: `Erro ao excluir - ${error.code}`,
        description: error.message
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger>Deletar {nameModal}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza que deseja deletar este {nameModal}?</DialogTitle>
          <DialogDescription>
            Esta ação não poderá ser desfeita. Tenha certeza que você está deletando o {nameModal} correto.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isLoading}>
              Fechar
            </Button>
          </DialogClose>
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deletando...
            </Button>
          ) : (
            <Button variant="destructive" onClick={deleteData}>Deletar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
