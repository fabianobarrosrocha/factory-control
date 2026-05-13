import { Status } from "@/types/common.types";

export type Foam = {
  id: number;
  name: string;
  short_code: string;
  density?: string | null;
  status: Status | string;
  created_at: string;
  updated_at: string;
};
