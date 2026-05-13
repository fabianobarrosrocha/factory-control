import { Status } from "@/types/common.types";

export type Foam = {
  id: number;
  name: string;
  short_code: string;
  size: string;
  description?: string | null;
  status: Status | string;
  created_at: string;
  updated_at: string;
};
