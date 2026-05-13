"use client";

import React, { useState } from "react";

import { z } from "zod";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { Form } from "@/components/ui/form";
import { Status } from "@/types/common.types";
import { Vendor } from "@/types/vendor.types";
import { Vacation } from "@/types/vacation.types";
import { Order } from "@/types/order.types";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";
import { Machine } from "@/types/machine.types";
import { Customer } from "@/types/customer.types";
import { Procedure } from "@/types/procedure.types";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatObject } from "@/services/formatInputs";
import { Classification, Employee } from "@/types/employee.types";
// removed SalesForecastStatus import for SalesForecast create payload
import { FormFieldsVendor } from "../FormFieldsObjectsCreate/FormFieldsVendor";
import { FormFieldsVacation } from "../FormFieldsObjectsCreate/FormFieldsVacation";
import { FormFieldsProduct } from "../FormFieldsObjectsCreate/FormFieldsProduct";
import { FormFieldsMachine } from "../FormFieldsObjectsCreate/FormFieldsMachine";
import { FormFieldsEmployee } from "../FormFieldsObjectsCreate/FormFieldsEmployee";
import { FormFieldsCustomer } from "../FormFieldsObjectsCreate/FormFieldsCustomer";
import { FormFieldsProcedure } from "../FormFieldsObjectsCreate/FormFieldsProcedure";
import { FormFieldsOrder } from "../FormFieldsObjectsCreate/FormFieldsOrder";
import { FormFieldsMaterialOrder } from "../FormFieldsObjectsCreate/FormFieldsMaterialOrder";
import { FormFieldsProductReturn } from "../FormFieldsObjectsCreate/FormFieldsProductReturn";
import { FormFieldsPayment } from "../FormFieldsObjectsCreate/FormFieldsPayment";
import { FormFieldsUser } from "../FormFieldsObjectsCreate/FormFieldsUser";
import { User } from "@/types/user.types";
import { Price } from "@/types/price.types";
import { Expense } from "@/types/expense.types";
import { FormFieldsPrice } from "../FormFieldsObjectsCreate/FormFieldsPrice";
import {
  formCustomerSchema,
  formEmployeeSchema,
  formMachineSchema,
  formProcedureSchema,
  formProductSchema,
  formVendorSchema,
  formVacationSchema,
  formOrderSchema,
  formMaterialOrderSchema,
  formProductReturnSchema,
  formPaymentSchema,
  formUserSchema,
  formUserCreateSchema,
  formPriceSchema,
  formMessageConfigSchema,
  formInvoiceSchema,
  formPackagingSchema,
  formDeliverySchema,
  formDeliveryPackagingSchema,
  formCustomerPackagingSchema,
  formStockSchema,
  formProductionControlSchema,
  formSalesForecastSchema,
  formExpenseSchema,
  formLabelPrintSchema,
  formLocationSchema,
  formColorSchema,
  formFoamSchema,
  formMoldSchema
} from "@/schemas/FormSchemas";
import {
  customerDefaultValues,
  employeeDefaultValues,
  machineDefaultValues,
  procedureDefaultValues,
  productDefaultValues,
  vendorDefaultValues,
  vacationDefaultValues,
  orderDefaultValues,
  materialOrderDefaultValues,
  productReturnDefaultValues,
  paymentDefaultValues,
  userDefaultValues,
  priceDefaultValues,
  messageConfigDefaultValues,
  invoiceDefaultValues,
  packagingDefaultValues,
  deliveryDefaultValues,
  deliveryPackagingDefaultValues,
  customerPackagingDefaultValues,
  stockDefaultValues,
  productionControlDefaultValues,
  salesForecastDefaultValues,
  expenseDefaultValues,
  labelPrintDefaultValues,
  locationDefaultValues,
  colorDefaultValues,
  foamDefaultValues,
  moldDefaultValues
} from "@/schemas/DefaultValuesForm";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { MaterialOrder } from "@/types/material-order.types";
import { ProductReturn, ProductReturnRegister } from "@/types/product_return.types";
import { PaymentRegister } from "@/types/payment.types";
import { FormFieldsMessageConfig } from "../FormFieldsObjectsCreate/FormFieldsMessageConfig";
import { FormFieldsInvoice } from "../FormFieldsObjectsCreate/FormFieldsInvoice";
import { FormFieldsPackaging } from "../FormFieldsObjectsCreate/FormFieldsPackaging";
import { FormFieldsDelivery } from "../FormFieldsObjectsCreate/FormFieldsDelivery";
import { FormFieldsDeliveryPackaging } from "../FormFieldsObjectsCreate/FormFieldsDeliveryPackaging";
import { FormFieldsCustomerPackaging } from "../FormFieldsObjectsCreate/FormFieldsCustomerPackaging";
import { FormFieldsStock } from "../FormFieldsObjectsCreate/FormFieldsStock";
import { FormFieldsProductionControl } from "../FormFieldsObjectsCreate/FormFieldsProductionControl";
import { FormFieldsSalesForecast } from "../FormFieldsObjectsCreate/FormFieldsSalesForecast";
import { FormFieldsExpense } from "../FormFieldsObjectsCreate/FormFieldsExpense";
import { FormFieldsLabelPrint } from "../FormFieldsObjectsCreate/FormFieldsLabelPrint";
import { FormFieldsLocation } from "../FormFieldsObjectsCreate/FormFieldsLocation";
import { FormFieldsColor } from "../FormFieldsObjectsCreate/FormFieldsColor";
import { FormFieldsFoam } from "../FormFieldsObjectsCreate/FormFieldsFoam";
import { FormFieldsMold } from "../FormFieldsObjectsCreate/FormFieldsMold";

interface ModalEditProps {
  nameModal: string;
  typeRegister: TypeRegister;
  rowData?: any;
  triggerLabel?: string;
}

type TypeRegister = "Customer" | "Employee" | "Machine" | "Procedure" | "Product" | "Vendor" | "Vacation" | "Order" | "MaterialOrder" | "ProductReturn" | "Payment" | "User" | "Price" | "MessageConfig" | "Invoice" | "Packaging" | "Delivery" | "DeliveryPackaging" | "CustomerPackaging" | "Stock" | "ProductionControl" | "SalesForecast" | "Expense" | "LabelPrint" | "Location" | "Color" | "Foam" | "Mold";

type FormData = z.infer<typeof formCustomerSchema> |
  z.infer<typeof formEmployeeSchema> |
  z.infer<typeof formMachineSchema> |
  z.infer<typeof formProcedureSchema> |
  z.infer<typeof formProductSchema> |
  z.infer<typeof formVendorSchema> |
  z.infer<typeof formVacationSchema> |
  z.infer<typeof formOrderSchema> |
  z.infer<typeof formMaterialOrderSchema> |
  z.infer<typeof formProductReturnSchema> |
  z.infer<typeof formPaymentSchema> |
  z.infer<typeof formUserSchema> |
  z.infer<typeof formPriceSchema> |
  z.infer<typeof formMessageConfigSchema> |
  z.infer<typeof formInvoiceSchema> |
  z.infer<typeof formPackagingSchema> |
  z.infer<typeof formDeliverySchema> |
  z.infer<typeof formDeliveryPackagingSchema> |
  z.infer<typeof formCustomerPackagingSchema> |
  z.infer<typeof formStockSchema> |
  z.infer<typeof formProductionControlSchema> |
  z.infer<typeof formSalesForecastSchema> |
  z.infer<typeof formExpenseSchema>;

const REGISTER_VERB_TYPES = new Set<TypeRegister>(["MaterialOrder"]);

const getActionVerbs = (typeRegister: TypeRegister) =>
  REGISTER_VERB_TYPES.has(typeRegister)
    ? { trigger: "Registrar", progressive: "Registrando", action: "Registrar" }
    : { trigger: "Criar", progressive: "Criando", action: "Criar" };

export const Create: React.FC<ModalEditProps> = ({ nameModal, typeRegister, rowData, triggerLabel }) => {
  const verbs = getActionVerbs(typeRegister);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDialogClose = () => {
    form.reset();
    setOpen(false);
    router.refresh();
  };

  let typeSchema: z.ZodType<FormData>;
  let apiCallByType: string;
  let objDefaultValues;
  let formFields1;

  switch (typeRegister) {
    case "Customer":
      typeSchema = formCustomerSchema;
      objDefaultValues = customerDefaultValues;
      apiCallByType = "customers";
      break;
    case "Employee":
      typeSchema = formEmployeeSchema;
      objDefaultValues = employeeDefaultValues;
      apiCallByType = "employees";
      break;
    case "Machine":
      typeSchema = formMachineSchema;
      objDefaultValues = machineDefaultValues;
      apiCallByType = "machines";
      break;
    case "Procedure":
      typeSchema = formProcedureSchema;
      objDefaultValues = procedureDefaultValues;
      apiCallByType = "procedures";
      break;
    case "Product":
      typeSchema = formProductSchema;
      objDefaultValues = productDefaultValues;
      apiCallByType = "products";
      break;
    case "Vendor":
      typeSchema = formVendorSchema;
      objDefaultValues = vendorDefaultValues;
      apiCallByType = "vendors";
      break;
    case "Vacation":
      typeSchema = formVacationSchema;
      objDefaultValues = vacationDefaultValues;
      apiCallByType = "employees/vacations";
      break;
    case "Order":
      typeSchema = formOrderSchema;
      objDefaultValues = orderDefaultValues;
      apiCallByType = "orders";
      break;
    case "MaterialOrder":
      typeSchema = formMaterialOrderSchema;
      objDefaultValues = materialOrderDefaultValues;
      apiCallByType = "material-orders";
      break;
    case "ProductReturn":
      typeSchema = formProductReturnSchema;
      objDefaultValues = productReturnDefaultValues;
      apiCallByType = "product-returns";
      break;
    case "Payment":
      typeSchema = formPaymentSchema;
      objDefaultValues = paymentDefaultValues;
      apiCallByType = "payments";
      break;
    case "User":
      typeSchema = formUserCreateSchema;
      objDefaultValues = userDefaultValues;
      apiCallByType = "users";
      break;
    case "Price":
      typeSchema = formPriceSchema;
      objDefaultValues = priceDefaultValues;
      apiCallByType = "prices";
      break;
    case "MessageConfig":
      typeSchema = formMessageConfigSchema;
      objDefaultValues = messageConfigDefaultValues;
      apiCallByType = "messages/config";
      break;
    case "Invoice":
      typeSchema = formInvoiceSchema;
      objDefaultValues = invoiceDefaultValues;
      apiCallByType = "invoices";
      break;
    case "Packaging":
      typeSchema = formPackagingSchema;
      objDefaultValues = packagingDefaultValues;
      apiCallByType = "packaging";
      break;
    case "Stock":
      typeSchema = formStockSchema;
      objDefaultValues = stockDefaultValues;
      apiCallByType = "stocks";
      break;
    case "ProductionControl":
      typeSchema = formProductionControlSchema;
      objDefaultValues = productionControlDefaultValues;
      apiCallByType = "production-control";
      break;
    case "SalesForecast":
      typeSchema = formSalesForecastSchema as any;
      objDefaultValues = salesForecastDefaultValues;
      apiCallByType = "sales-forecasts";
      break;
    case "Expense":
      typeSchema = formExpenseSchema;
      objDefaultValues = expenseDefaultValues;
      apiCallByType = "expenses";
      break;
    case "LabelPrint":
      typeSchema = formLabelPrintSchema as any;
      objDefaultValues = labelPrintDefaultValues;
      apiCallByType = "label-prints";
      break;
    case "Delivery":
      typeSchema = formDeliverySchema;
      objDefaultValues = deliveryDefaultValues;
      apiCallByType = "delivery";
      break;
    case "DeliveryPackaging":
      typeSchema = formDeliveryPackagingSchema;
      objDefaultValues = deliveryPackagingDefaultValues;
      apiCallByType = "delivery-packaging";
      break;
    case "CustomerPackaging":
      typeSchema = formCustomerPackagingSchema;
      objDefaultValues = customerPackagingDefaultValues;
      apiCallByType = "customer-packaging";
      break;
    case "Location":
      typeSchema = formLocationSchema;
      objDefaultValues = locationDefaultValues;
      apiCallByType = "locations";
      break;
    case "Color":
      typeSchema = formColorSchema;
      objDefaultValues = colorDefaultValues;
      apiCallByType = "colors";
      break;
    case "Foam":
      typeSchema = formFoamSchema;
      objDefaultValues = foamDefaultValues;
      apiCallByType = "foams";
      break;
    case "Mold":
      typeSchema = formMoldSchema;
      objDefaultValues = moldDefaultValues;
      apiCallByType = "molds";
      break;
    default:
      throw new Error(`Invalid typeRegister: ${typeRegister}`);
  }

  const form = useForm<FormData>({
    resolver: zodResolver(typeSchema),
    defaultValues: objDefaultValues as any,
    disabled: isLoading
  });

  switch (typeRegister) {
    case "Customer":
      formFields1 = <FormFieldsCustomer form={form} />;
      break;
    case "Employee":
      formFields1 = <FormFieldsEmployee form={form} />;
      break;
    case "Machine":
      formFields1 = <FormFieldsMachine form={form} />;
      break;
    case "Procedure":
      formFields1 = <FormFieldsProcedure form={form} />;
      break;
    case "Product":
      formFields1 = <FormFieldsProduct form={form} />;
      break;
    case "Vendor":
      formFields1 = <FormFieldsVendor form={form} />;
      break;
    case "Vacation":
      formFields1 = <FormFieldsVacation form={form} />;
      break;
    case "Order":
      formFields1 = <FormFieldsOrder form={form} />;
      break;
    case "MaterialOrder":
      formFields1 = <FormFieldsMaterialOrder form={form} />;
      break;
    case "ProductReturn":
      formFields1 = <FormFieldsProductReturn form={form} />;
      break;
    case "Payment":
      formFields1 = <FormFieldsPayment form={form} />;
      break;
    case "User":
      formFields1 = <FormFieldsUser form={form} />;
      break;
    case "Price":
      formFields1 = <FormFieldsPrice form={form as any} />;
      break;
    case "MessageConfig":
      formFields1 = <FormFieldsMessageConfig form={form as any} />;
      break;
    case "Invoice":
      formFields1 = <FormFieldsInvoice form={form as any} />;
      break;
    case "Packaging":
      formFields1 = <FormFieldsPackaging form={form} />;
      break;
    case "Stock":
      formFields1 = <FormFieldsStock form={form} />;
      break;
    case "ProductionControl":
      formFields1 = <FormFieldsProductionControl form={form} />;
      break;
    case "Delivery":
      formFields1 = <FormFieldsDelivery form={form} />;
      break;
    case "SalesForecast":
      formFields1 = <FormFieldsSalesForecast form={form} />;
      break;
    case "Expense":
      formFields1 = <FormFieldsExpense form={form} />;
      break;
    case "LabelPrint":
      formFields1 = <FormFieldsLabelPrint form={form} />;
      break;
    case "DeliveryPackaging":
      formFields1 = <FormFieldsDeliveryPackaging form={form} deliveryId={rowData?.delivery_id} />;
      break;
    case "CustomerPackaging":
      // Reutilizaremos um novo form field específico
      formFields1 = <FormFieldsCustomerPackaging form={form} packagingId={rowData?.packaging_id} />;
      break;
    case "Location":
      formFields1 = <FormFieldsLocation form={form} />;
      break;
    case "Color":
      formFields1 = <FormFieldsColor form={form} />;
      break;
    case "Foam":
      formFields1 = <FormFieldsFoam form={form} />;
      break;
    case "Mold":
      formFields1 = <FormFieldsMold form={form} />;
      break;
    default:
      formFields1 = <div>erro</div>;
      break;
  }

  async function onSubmit(data: FormData) {
    const enumsToReplace = typeRegister === "SalesForecast" ? [] : [Classification, Status];
    const formattedData = formatObject(data as any, enumsToReplace as any);
    setIsLoading(true);
    try {
      await axios.post(`/api/${apiCallByType}`, formattedData);
      setIsLoading(false);
      form.reset();
      setOpen(false);
      toast({
        title: "Registro",
        description: `${nameModal} foi criado com sucesso.`
      });
      // Reload page to refresh data since we use client-side fetching
      window.location.reload();
    } catch (err) {
      const error = err as AxiosError;
      console.error(error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: `Erro ao registrar - ${error.code}`,
        description: error.message
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">{triggerLabel ?? `${verbs.trigger} ${nameModal}`}</Button>
      </DialogTrigger>
      <Form {...form}>
        <DialogContent className="min-w-full min-h-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{`${verbs.progressive} ${nameModal}`}</DialogTitle>
            </DialogHeader>
            <div className="pt-4 grid grid-cols-3 gap-4">{formFields1}</div>
            <DialogFooter className="absolute bottom-0 right-0 p-10">
              <Button type="button" variant="secondary" disabled={isLoading} onClick={handleDialogClose}>
                Fechar
              </Button>
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {`${verbs.progressive}...`}
                </Button>
              ) : (
                <Button type="submit">{verbs.action}</Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};
