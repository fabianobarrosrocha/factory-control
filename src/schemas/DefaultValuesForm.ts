export const employeeDefaultValues = {
  name: "",
  phone: undefined,
  cel_number: "",
  cpf: "",
  classification: undefined,
  birth_date: undefined,
  salary: undefined,
  admission: undefined,
  dismissal_date: undefined
};

export const customerDefaultValues = {
  name: "",
  phone: "",
  cel_number: "",
  email: "",
  store_name: "",
  credit_limit: "",
  debts: "",
  cpf: "",
  cnpj: "",
  deliver: false,
  pontalti: false,
  secondary_line: false,
  status: undefined,
  address: {
    zip_code: "",
    neighborhood: "",
    public_place: "",
    city: "",
    state: "",
    complement: undefined,
    address_number: ""
  }
};

export const machineDefaultValues = {
  model: "",
  machine_number: "",
  location_id: undefined,
  status: undefined,
  location_status: undefined
};

export const procedureDefaultValues = {
  process_name: "",
  workers: "",
  status: undefined
};

export const productDefaultValues = {
  name: "",
  model: "",
  size: "",
  sales: "",
  volume_sales: "",
  invoicing: "",
  character: "",
  moldes: "",
  equivalency: "",
  status: undefined
};

export const vendorDefaultValues = {
  name: "",
  store_name: "",
  cnpj: "",
  cel_number: "",
  phone: "",
  deliver: false,
  volume_purchases: "",
  purchases: "",
  invoicing: "",
  status: undefined,
  address: {
    zip_code: "",
    neighborhood: "",
    public_place: "",
    city: "",
    state: "",
    complement: undefined,
    address_number: ""
  }
};

export const vacationDefaultValues = {
  employee_id: "",
  start_date: new Date(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  sold_days: ""
};

export const orderDefaultValues = {
  final_price: "",
  date: new Date(),
  customer_id: "",
  products: []
};

export const materialOrderDefaultValues = {
  amount: "",
  unit: "",
  date: undefined,
  storage_location: "",
  received_by: "",
  product_id: "",
  vendor_id: ""
};

export const productReturnDefaultValues = {
  product_return: {
    date: undefined,
    replacement_necessary: "",
    resold: "",
    return_reason: "",
    storage_location: "",
    order_id: ""
  },
  returned_labels: []
};

export const paymentDefaultValues = {
  amount_paid: "",
  payment_method: "",
  date: undefined,
  order_id: ""
};

export const userDefaultValues = {
  name: "",
  email: "",
  password: "",
  isAdmin: false
};

export const priceDefaultValues = {
  product_id: 0,
  customer_id: undefined,
  production_cost: 0,
  operational_margin: 0,
  final_price: 0,
  second_line_price: undefined,
  frozen_until: undefined,
  status: undefined
};

export const messageConfigDefaultValues = {
  customer_id: 0,
  can_whatsapp: false,
  can_whatsapp_attachments: false,
  can_telegram: false,
  can_telegram_attachments: false,
  can_email: false,
  can_email_attachments: false
};

export const invoiceDefaultValues = {
  order_id: "",
  number: "",
  status: "",
  type: "",
  issue_date: "",
  recipient: "",
  note: ""
};

export const packagingDefaultValues = {
  name: "",
  quantity: "",
  storage_location: ""
};

export const deliveryDefaultValues = {
  order_id: "",
  status: undefined,
  delivery_date: new Date()
};

export const deliveryPackagingDefaultValues = {
  delivery_id: 0,
  packaging_id: 0,
  quantity: 1
};

export const customerPackagingDefaultValues = {
  customer_id: 0,
  packaging_id: 0,
  pontalti_brand: false
};

export const stockDefaultValues = {
  amount: 0,
  location_id: undefined,
  product_id: 0
};

export const productionControlDefaultValues = {
  order_id: 0,
  status: 0,
  material_disponibility: 0
};

export const salesForecastDefaultValues = {
  customer_id: 0,
  product_id: 0,
  status: undefined,
  reason: undefined,
  next_estimated_date: undefined,
  frequency_days: undefined,
  quantity: "0",
  created_by: undefined,
  updated_by: undefined
};

export const labelPrintDefaultValues = {
  order_id: 0,
  created_by: undefined,
  updated_by: undefined
};

export const expenseDefaultValues = {
  amount: undefined,
  classification: undefined,
  description: undefined,
  justification: "",
  requires_reimbursement: false,
  applies_all_products: false,
  applies_all_machines: false,
  expense_date: new Date(),
  expense_actor_id: 0,
  created_by: undefined,
  updated_by: undefined
};

export const locationDefaultValues = {
  name: "",
  code: "",
  status: undefined,
  position_x: 0,
  position_y: 0,
  width: 150,
  height: 120,
  color: "#3b82f6"
};

export const timeAdjustmentRequestDefaultValues = {
  work_hour_id: 0,
  proposed_clock_in: "",
  proposed_clock_out: "",
  reason: ""
};

export const timeAdjustmentReviewDefaultValues = {
  admin_comment: ""
};
