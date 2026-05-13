import { Status } from "./common.types";
import { Color } from "./color.types";
import { Foam } from "./foam.types";
import { Mold } from "./mold.types";

export type ProductType = "bojo" | "dublado";

export const PRODUCT_TYPES: readonly ProductType[] = ["bojo", "dublado"] as const;

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  bojo: "Bojo",
  dublado: "Dublado"
};

export type Product = {
  id: number;
  type: ProductType;
  sku: string;
  inner_color_id: number;
  foam_id: number;
  outer_color_id: number;
  mold_id?: number | null;
  status: Status | string;
  created_at: string;
  updated_at: string;
  inner_color?: Color;
  outer_color?: Color;
  foam?: Foam;
  mold?: Mold | null;
};
