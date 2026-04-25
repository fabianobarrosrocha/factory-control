import { z } from "zod";
import { Status } from "@/types/common.types";
import { Classification } from "@/types/employee.types";
import { SalesForecastStatus } from "@/types/sales-forecast.types";
import { z as zod } from "zod";

const optionalText = z
  .string()
  .optional()
  .transform((value) => (value?.trim() ? value : undefined));
const optionalEmail = optionalText.refine((value) => !value || z.string().email().safeParse(value).success, {
  message: "Informe um email válido."
});
const optionalPhone = (message: string) =>
  optionalText.refine((value) => !value || value.replace(/\D/g, "").length >= 10, { message });

export const formCustomerSchema = z
  .object({
    name: z.string().min(2, {
      message: "Informe o nome."
    }),
    phone: optionalPhone("Informe um telefone válido."),
    cel_number: optionalPhone("Informe um celular válido."),
    email: optionalEmail,
    store_name: z.string().min(2, {
      message: "Informe o nome da loja."
    }),
    credit_limit: z.number({ coerce: true }).positive({
      message: "Informe o limite de crédito."
    }),
    debts: z.number({ coerce: true }).positive({
      message: "Informe o débito."
    }),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    deliver: z.string({ message: "Informe se é entrega ou retirada." }),
    pontalti: z.string({ message: "Informe se é da Pontalti." }),
    secondary_line: z.string({ message: "Informe se é linha secundária." }),
    status: z.nativeEnum(Status),
    address: z.object({
      zip_code: z
        .string()
        .min(2, {
          message: "Informe o CEP."
        })
        .refine((cep) => validaCep(cep), {
          message: "CEP Inválido."
        }),
      neighborhood: z.string().min(2, {
        message: "Informe o bairro."
      }),
      public_place: z.string().min(2, {
        message: "Informe a rua/avenida."
      }),
      city: z.string().min(2, {
        message: "Informe a cidade."
      }),
      state: z
        .string()
        .min(2, { message: "Informe a sigla do Estado." })
        .max(2, { message: "Informe a sigla do Estado." }),
      complement: z.string().optional(),
      address_number: z.number({ coerce: true }).min(1, {
        message: "Informe o número do endereço."
      })
    })
  })
  .partial()
  .superRefine((data, ctx) => {
    if (!data.phone && !data.cel_number && !data.email) {
      const message = "Informe ao menos um contato: telefone, celular ou email";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["phone"]
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["cel_number"]
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["email"]
      });
    }

    if (!data.cpf && !data.cnpj) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CPF ou CNPJ devem ser inseridos",
        path: ["cpf"]
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CPF ou CNPJ devem ser inseridos",
        path: ["cnpj"]
      });
    }
  });

export const formEmployeeSchema = z.object({
  name: z.string().min(2, {
    message: "Informe o nome."
  }),
  phone: z
    .string()
    .min(11, {
      message: "Informe o número de telefone."
    })
    .optional(),
  cel_number: z.string().min(11, {
    message: "Informe o número de celular."
  }),
  cpf: z.string().min(11, {
    message: "Informe o CPF."
  }),
  classification: z.nativeEnum(Classification),
  salary: z.number({ coerce: true }).optional(),
  admission: z.date({ required_error: "Informe a data de admissão." }),
  dismissal_date: z.date().optional()
});

export const formMachineSchema = z.object({
  model: z.string().min(2, {
    message: "Informe o modelo."
  }),
  machine_number: z.number({
    coerce: true,
    invalid_type_error: "Informe o número da máquina."
  }),
  location_id: z.number({ coerce: true }).positive({ message: "Selecione uma localização." }).optional(),
  status: z.nativeEnum(Status),
  location_status: z.nativeEnum(Status)
});

export const formProcedureSchema = z.object({
  process_name: z.string().min(2, {
    message: "Informe o nome do processo."
  }),
  workers: z.number({
    coerce: true,
    invalid_type_error: "Informe o número de trabalhadores."
  }),
  status: z.nativeEnum(Status)
});

export const formProductSchema = z.object({
  name: z.string().min(2, {
    message: "Informe o nome."
  }),
  model: z.string().min(1, {
    message: "Informe o modelo."
  }),
  size: z.string().min(1, {
    message: "Informe o tamanho."
  }),
  sales: z.number({
    coerce: true,
    invalid_type_error: "Informe o número de vendas."
  }),
  volume_sales: z.number({
    coerce: true,
    invalid_type_error: "Informe o volume de vendas."
  }),
  invoicing: z.number({ coerce: true }).positive({
    message: "Informe o valor das compras."
  }),
  character: z.string(),
  moldes: z.number({ coerce: true, invalid_type_error: "Informe os moldes." }),
  equivalency: z.number({
    coerce: true,
    invalid_type_error: "Informe a equivalência."
  }),
  status: z.nativeEnum(Status)
});

export const formVendorSchema = z
  .object({
    name: z.string().min(2, {
      message: "Informe o nome."
    }),
    store_name: z.string().min(2, {
      message: "Informe o nome da loja."
    }),
    cnpj: z.string().min(14, {
      message: "Informe o CNPJ."
    }),
    cel_number: optionalPhone("Informe um celular válido."),
    phone: optionalPhone("Informe um telefone válido."),
    deliver: z.string(),
    volume_purchases: z.number({
      coerce: true,
      invalid_type_error: "Informe o volume de compras."
    }),
    purchases: z.number({ coerce: true }).positive({
      message: "Informe o valor das compras."
    }),
    invoicing: z.number({ coerce: true }).positive({
      message: "Informe o faturamento."
    }),
    status: z.nativeEnum(Status),
    address: z.object({
      zip_code: z
        .string()
        .min(2, {
          message: "Informe o CEP."
        })
        .refine((cep) => validaCep(cep), {
          message: "CEP Inválido."
        }),
      neighborhood: z.string().min(2, {
        message: "Informe o bairro."
      }),
      public_place: z.string().min(2, {
        message: "Informe a rua/avenida."
      }),
      city: z.string().min(2, {
        message: "Informe a cidade."
      }),
      state: z
        .string()
        .min(2, { message: "Informe a sigla do Estado." })
        .max(2, { message: "Informe a sigla do Estado." }),
      complement: z.string().optional(),
      address_number: z.number({ coerce: true }).min(1, {
        message: "Informe o número do endereço."
      })
    })
  })
  .superRefine((data, ctx) => {
    if (!data.phone && !data.cel_number) {
      const message = "Informe ao menos um contato: telefone ou celular";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["phone"]
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["cel_number"]
      });
    }
  });

export const signInFormSchema = z.object({
  email: z.string().email().min(1, {
    message: "Insira um email pontalti."
  }),
  password: z.string().min(1, {
    message: "Insira uma senha."
  })
});

export const formUserSchema = z.object({
  name: z.string().min(2, {
    message: "Informe o nome."
  }),
  email: z.string().email({
    message: "Informe um email válido."
  }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "A senha deve ter no mínimo 6 caracteres."
    }),
  isAdmin: z.boolean().default(false)
});

export const formUserCreateSchema = z.object({
  name: z.string().min(2, {
    message: "Informe o nome."
  }),
  email: z.string().email({
    message: "Informe um email válido."
  }),
  password: z.string().min(6, {
    message: "A senha deve ter no mínimo 6 caracteres."
  }),
  isAdmin: z.boolean().default(false)
});

export const formVacationSchema = z.object({
  employee_id: z.number({ coerce: true }).positive({
    message: "Informe o ID do funcionário."
  }),
  start_date: z.date({ required_error: "Informe a data de início." }),
  end_date: z.date({ required_error: "Informe a data de término." }),
  sold_days: z.number({ coerce: true }).positive({
    message: "Informe a quantidade de dias vendidos."
  })
});

export const formTimeConfigurationSchema = z.object({
  work_start: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato inválido. Use HH:mm"),
  work_end: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato inválido. Use HH:mm"),
  late_limit_in_minutes: z.number({ coerce: true }).min(0, "Deve ser um valor positivo")
});

export const formOrderSchema = z.object({
  final_price: z.number({ coerce: true }).positive({
    message: "Informe o faturamento."
  }),
  date: z.date({ required_error: "Informe a data." }),
  customer_id: z.number({ coerce: true }).positive({
    message: "Informe o Id do cliente."
  }),
  products: z
    .array(
      z.object({
        product_id: z.number({ coerce: true }),
        quantity: z.number({ coerce: true })
      })
    )
    .nonempty({ message: "Adicione ao menos um produto." })
});

export const formMaterialOrderSchema = z.object({
  date: z.date({ required_error: "Informe a data." }),
  amount: z.number({ coerce: true }).positive({
    message: "Informe a quantidade."
  }),
  unit: z.string().min(1, {
    message: "Informe a unidade de medida."
  }),
  storage_location: z.string().min(2, {
    message: "Informe o local de armazenamento."
  }),
  received_by: z.string().min(2, {
    message: "Informe o nome de quem recebeu."
  }),
  product_id: z.number({ coerce: true, invalid_type_error: "Informe o ID do produto." }).positive({
    message: "Informe o Id do produto."
  }),
  vendor_id: z.number({ coerce: true, invalid_type_error: "Informe o ID do fornecedor." }).positive({
    message: "Informe o Id do fornecedor."
  })
});

export const formProductReturnSchema = z.object({
  product_return: z.object({
    date: z.date({ required_error: "Informe a data." }),
    replacement_necessary: z.string().min(1, {
      message: "Informe se é necessário substituição."
    }),
    resold: z.string().min(1, {
      message: "Informe se é revenda."
    }),
    return_reason: z.string().min(1, {
      message: "Informe o motivo da devolução."
    }),
    order_id: z.number({ coerce: true, invalid_type_error: "Informe o ID do pedido." }).positive({
      message: "Informe o Id do pedido."
    })
  }),
  returned_labels: z
    .array(
      z.object({
        ticket_code: z.string(),
        opened: z.string(),
        quantity: z.number({ coerce: true })
      })
    )
    .nonempty({ message: "Adicione ao menos um produto." })
});

export const formPaymentSchema = z.object({
  amount_paid: z
    .number({
      coerce: true,
      invalid_type_error: "Informe o valor do total pago."
    })
    .positive({
      message: "Informe o valor do total pago."
    }),
  payment_method: z.string().min(1, {
    message: "Informe o método de pagamento."
  }),
  date: z.date({ required_error: "Informe a data." }),
  order_id: z.number({ coerce: true, invalid_type_error: "Informe o ID do pedido." }).positive({
    message: "Informe o Id do pedido."
  })
});

export const formPriceSchema = z.object({
  product_id: z.number(),
  customer_id: z.number().optional(),
  production_cost: z.number().min(0, "O custo de produção deve ser maior que 0"),
  operational_margin: z.number().min(0, "A margem operacional deve ser maior que 0"),
  final_price: z.number().min(0, "O preço final deve ser maior que 0"),
  second_line_price: z.number().min(0, "O preço de segunda linha deve ser maior que 0").optional(),
  frozen_until: z.date().optional(),
  status: z.string()
});

export const formMessageConfigSchema = z.object({
  customer_id: z.number({ coerce: true }).positive({
    message: "Informe o ID do cliente."
  }),
  can_whatsapp: z.boolean(),
  can_whatsapp_attachments: z.boolean(),
  can_telegram: z.boolean(),
  can_telegram_attachments: z.boolean(),
  can_email: z.boolean(),
  can_email_attachments: z.boolean()
});

export const formInvoiceSchema = z.object({
  order_id: z.number({
    coerce: true,
    invalid_type_error: "Informe o ID do pedido."
  }),
  number: z.string().min(2, { message: "Informe o número da nota fiscal." }),
  status: z.string().min(2, { message: "Informe o status." }),
  type: z.string().min(2, { message: "Informe o tipo." }),
  issue_date: z.string().min(2, { message: "Informe a data de emissão." }),
  recipient: z.string().min(2, { message: "Informe o destinatário." }),
  note: z.string().optional()
});

export const formPackagingSchema = z.object({
  name: z.string().min(2, {
    message: "Informe o nome da embalagem."
  }),
  quantity: z.number({ coerce: true }).positive({
    message: "Informe a quantidade."
  }),
  storage_location: z.string().min(2, {
    message: "Informe o local de armazenamento."
  })
});

export const formDeliverySchema = z.object({
  order_id: z.number({ coerce: true }).positive({
    message: "Informe o ID do pedido."
  }),
  status: z.number({ coerce: true }).min(1).max(3, {
    message: "Informe o status da entrega."
  }),
  delivery_date: z.date({
    required_error: "Informe a data de entrega."
  })
});

export const formDeliveryPackagingSchema = z.object({
  delivery_id: z.number({ coerce: true }).positive({
    message: "Informe o ID da entrega."
  }),
  packaging_id: z.number({ coerce: true }).positive({
    message: "Informe o ID da embalagem."
  }),
  quantity: z.number({ coerce: true }).positive({
    message: "Informe a quantidade."
  })
});

export const formCustomerPackagingSchema = z.object({
  customer_id: z.number({ coerce: true }).positive({
    message: "Informe o ID do cliente."
  }),
  packaging_id: z.number({ coerce: true }).positive({
    message: "Informe o ID da embalagem."
  }),
  pontalti_brand: z.boolean()
});

export const formStockSchema = z.object({
  amount: z.number({ coerce: true }).min(0, { message: "Informe a quantidade (>= 0)." }),
  location_id: z.number({ coerce: true }).positive({ message: "Selecione uma localização." }).optional(),
  product_id: z.number({ coerce: true }).positive({ message: "Informe o ID do produto." })
});

export const formProductionControlSchema = z.object({
  order_id: z.number({ coerce: true }).positive({ message: "Informe o ID do pedido." }),
  status: z.number({ coerce: true }).min(0, { message: "Informe o status." }),
  material_disponibility: z.number({ coerce: true }).min(0, { message: "Informe a disponibilidade de material." })
});

export const formSalesForecastSchema = z.object({
  customer_id: z.number({ coerce: true }).positive({ message: "Informe o ID do cliente." }),
  product_id: z.number({ coerce: true }).positive({ message: "Informe o ID do produto." }),
  status: z.nativeEnum(SalesForecastStatus),
  reason: z.string().optional(),
  next_estimated_date: z.date().optional(),
  frequency_days: z.number({ coerce: true }).int().positive().optional(),
  quantity: z.string().min(1, { message: "Informe a quantidade." }),
  created_by: z.string().optional(),
  updated_by: z.string().optional()
});

export const formLabelPrintSchema = z.object({
  order_id: z.number({ coerce: true }).positive({ message: "Informe o ID do pedido." }),
  created_by: z.string().optional(),
  updated_by: z.string().optional()
});

export const formExpenseSchema = z.object({
  amount: z.string().min(1, { message: "Informe o valor da despesa." }),
  classification: z.string().optional(),
  description: z.string().optional(),
  justification: z.string().min(1, { message: "Informe a justificativa." }),
  requires_reimbursement: z.boolean(),
  applies_all_products: z.boolean(),
  applies_all_machines: z.boolean(),
  expense_date: z.date({ message: "Informe a data da despesa." }),
  expense_actor_id: z.number({ coerce: true }).positive({ message: "Informe o ID do ator." }),
  created_by: z.string().optional(),
  updated_by: z.string().optional()
});

export const formLocationSchema = z.object({
  name: z.string().min(2, { message: "Informe o nome da localização." }),
  code: z.string().min(1, { message: "Informe o código." }),
  status: z.nativeEnum(Status),
  position_x: z.number({ coerce: true }).default(0),
  position_y: z.number({ coerce: true }).default(0),
  width: z.number({ coerce: true }).min(50, { message: "Largura mínima 50px" }).default(100),
  height: z.number({ coerce: true }).min(50, { message: "Altura mínima 50px" }).default(100),
  color: z.string().default("#3b82f6")
});

// Time Adjustment Request schemas
export const formTimeAdjustmentRequestSchema = z
  .object({
    work_hour_id: z.number({
      required_error: "Selecione um registro de ponto."
    }),
    proposed_clock_in: z.string().optional(),
    proposed_clock_out: z.string().optional(),
    reason: z.string().optional()
  })
  .refine((data) => data.proposed_clock_in || data.proposed_clock_out, {
    message: "Informe pelo menos uma alteração (entrada ou saída)."
  });

export const formTimeAdjustmentReviewSchema = z.object({
  admin_comment: z.string().optional()
});

function validaCep(cep: string) {
  return /^\d{8}$/.test(cep.replace(/[^\d]+/g, ""));
}
