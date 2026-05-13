import { Customer } from "./customer.types";
import { OrderItem } from "./order-item.types";

export type Order = {
  id: number;
  final_price: number;
  discount: number;
  date: Date;
  created_at: Date;
  updated_at: Date;
  customer: Customer;
  items: OrderItem[];
};


