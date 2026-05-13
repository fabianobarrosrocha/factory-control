export enum Classification {
  funcionario = "Funcionario",
  em_teste = "Em teste",
  externo = "Externo",
  gerente = "Gerente"
}

export type Employee = {
  id: number;
  name: string;
  phone?: string;
  cel_number: string;
  cpf: string;
  classification: Classification;
  birth_date?: Date;
  admission: Date;
  salary?: number;
  dismissal_date?: Date;
  created_at: Date;
  updated_at: Date;
};
