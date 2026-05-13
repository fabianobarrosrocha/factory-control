export type OrderItem = {
  product_id: number;
  quantity: number;
  unit_price: number;
  registered_price?: number | null;
};
