import { Status } from "@/types/common.types";

export type Color = {
  id: number;
  name: string;
  short_code: string;
  hex_code?: string | null;
  status: Status | string;
  created_at: string;
  updated_at: string;
};
