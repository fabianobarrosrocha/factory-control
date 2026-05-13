import { Product, PRODUCT_TYPE_LABELS } from "@/types/product.types";

/**
 * Retorna o SKU armazenado quando disponível, ou monta um a partir das
 * relações (fallback quando o backend ainda não enviou o sku).
 */
export const getProductSku = (product: Pick<Product, "sku" | "type" | "inner_color" | "outer_color" | "foam" | "mold">): string => {
  if (product.sku) return product.sku;
  const prefix = product.type === "bojo" ? "BJ" : "DB";
  const parts = [prefix];
  if (product.inner_color?.short_code) parts.push(product.inner_color.short_code);
  if (product.foam?.short_code) parts.push(product.foam.short_code);
  if (product.outer_color?.short_code) parts.push(product.outer_color.short_code);
  if (product.type === "bojo" && product.mold?.short_code) parts.push(product.mold.short_code);
  return parts.join("-");
};

/**
 * Label legível: "Bojo · Preto / D28 / Branco / Molde P".
 */
export const getProductLabel = (
  product: Pick<Product, "type" | "inner_color" | "outer_color" | "foam" | "mold">
): string => {
  const typeLabel = PRODUCT_TYPE_LABELS[product.type] ?? product.type;
  const middle = [product.inner_color?.name, product.foam?.name, product.outer_color?.name]
    .filter(Boolean)
    .join(" / ");
  const tail = product.type === "bojo" && product.mold?.name ? ` / ${product.mold.name}` : "";
  return `${typeLabel} · ${middle}${tail}`;
};

/**
 * Label compacto com SKU à frente: "BJ-PRT-D28-BCO-MP — Bojo · Preto / D28 / Branco / Molde P"
 */
export const getProductFullLabel = (
  product: Pick<Product, "sku" | "type" | "inner_color" | "outer_color" | "foam" | "mold">
): string => {
  const sku = getProductSku(product);
  const label = getProductLabel(product);
  return `${sku} — ${label}`;
};
