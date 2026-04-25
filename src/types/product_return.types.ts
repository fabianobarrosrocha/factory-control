import { Order } from "./order.types";
import { ReturnedLabel } from "./returned_labels.types";

export type ProductReturn = {
  id: number;
  return_reason: string;
  replacement_necessary: boolean;
  resold: boolean;
  storage_location: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
  order: Order;
};

export type ProductReturnRegister = Omit<ProductReturn, "id" | "created_at" | "updated_at" | "customer" | "order"> & {
  order_id: number;
  returned_labels: ReturnedLabel;
};

export type UpdatePartialProductReturn = Partial<ProductReturn>;
