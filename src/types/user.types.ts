export type AccessLevel = "administrator" | "standard";

export const ACCESS_LEVELS: readonly AccessLevel[] = ["administrator", "standard"] as const;

export const ACCESS_LEVEL_LABELS: Record<AccessLevel, string> = {
  administrator: "Administrador",
  standard: "Padrão"
};

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
};

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  access_level: AccessLevel;
};
