export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  created_at: string;
  updated_at: string;
};

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};
