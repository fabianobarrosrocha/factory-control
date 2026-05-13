import { Status } from "@/types/common.types";

export type Mold = {
  id: number;
  name: string;
  short_code: string;
  size?: string | null;
  status: Status | string;
  created_at: string;
  updated_at: string;
};
