import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const formatBRL = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === "") return "";
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return "";
  return brlFormatter.format(num);
};

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value?: number | string | null;
  onChange?: (value: number | undefined) => void;
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, className, ...rest }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const digits = event.target.value.replace(/\D/g, "");
      if (digits === "") {
        onChange?.(undefined);
        return;
      }
      onChange?.(Number(digits) / 100);
    };

    return (
      <div className="relative ml-auto flex-1">
        <span className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground">R$</span>
        <Input
          ref={ref}
          inputMode="numeric"
          value={formatBRL(value)}
          onChange={handleChange}
          className={cn("w-full rounded-lg bg-background pl-8 pt-2.5", className)}
          {...rest}
        />
      </div>
    );
  }
);
MoneyInput.displayName = "MoneyInput";
