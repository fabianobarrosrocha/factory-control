export interface Invoice {
  id: number;
  order_id: number;
  number: string;
  status: string;
  type: string;
  issue_date: string;
  recipient: string;
  note: string;
  created_at: string;
  updated_at: string;
  order: {
    id: number;
    final_price: number;
    date: string;
    created_at: string;
    updated_at: string;
    customer_id: number;
    customer: {
      id: number;
      status: number;
      address_id: number;
      credit_limit: number;
      debts: number;
      name: string;
      phone?: string | null;
      cel_number?: string | null;
      email?: string | null;
      store_name: string;
      deliver: boolean;
      pontalti: boolean;
      secondary_line: boolean;
      cpf?: string | null;
      cnpj?: string | null;
      created_at: string;
      updated_at: string;
    };
  };
}
