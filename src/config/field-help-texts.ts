/**
 * Textos de ajuda para campos de formulário
 * Organizados por entidade para facilitar manutenção
 */

export const fieldHelpTexts = {
  // ==================== EMPLOYEE ====================
  employee: {
    name: "Nome completo do funcionário que será exibido no sistema.",
    phone: "Número de telefone fixo para contato. Formato: (99) 9999-9999",
    cel_number: "Número de celular principal do funcionário. Formato: (99) 99999-9999",
    cpf: "CPF do funcionário. Este documento é único e será usado para identificação.",
    birth_date: "Data de nascimento do funcionário.",
    classification: "Define o tipo/cargo do funcionário na empresa (ex: Funcionário, Gerente, etc).",
    salary: "Salário mensal do funcionário em reais.",
    admission: "Data em que o funcionário foi admitido na empresa.",
    dismissal_date: "Data de desligamento do funcionário. Deixe em branco se ainda estiver ativo."
  },

  // ==================== CUSTOMER ====================
  customer: {
    name: "Nome completo do cliente ou razão social.",
    store_name: "Nome fantasia ou nome da loja do cliente.",
    email: "E-mail principal para comunicação e envio de documentos.",
    phone: "Telefone fixo para contato comercial.",
    cel_number: "Celular do cliente para contato direto.",
    cpf: "CPF do cliente (pessoa física). Deixe em branco se for pessoa jurídica.",
    cnpj: "CNPJ do cliente (pessoa jurídica). Deixe em branco se for pessoa física.",
    state_registration: "Inscrição estadual do cliente, necessária para emissão de notas fiscais.",
    status: "Define se o cliente está ativo ou suspenso no sistema.",
    public_place: "Logradouro (rua, avenida, etc) do endereço do cliente.",
    address_number: "Número do endereço.",
    complement: "Complemento do endereço (apartamento, sala, bloco, etc).",
    neighborhood: "Bairro do endereço.",
    city: "Cidade do endereço.",
    state: "Estado/UF do endereço.",
    zip_code: "CEP do endereço. Formato: 99999-999"
  },

  // ==================== VENDOR ====================
  vendor: {
    name: "Nome do fornecedor ou razão social.",
    email: "E-mail para contato e pedidos.",
    phone: "Telefone fixo do fornecedor.",
    cel_number: "Celular do fornecedor.",
    cpf: "CPF do fornecedor (pessoa física).",
    cnpj: "CNPJ do fornecedor (pessoa jurídica).",
    status: "Define se o fornecedor está ativo ou suspenso.",
    public_place: "Logradouro do endereço do fornecedor.",
    address_number: "Número do endereço.",
    complement: "Complemento do endereço.",
    neighborhood: "Bairro do endereço.",
    city: "Cidade do endereço.",
    state: "Estado/UF do endereço.",
    zip_code: "CEP do endereço."
  },

  // ==================== PRODUCT ====================
  product: {
    name: "Nome do produto que será exibido no sistema e em documentos.",
    model: "Modelo ou versão do produto.",
    size: "Tamanho ou dimensões do produto.",
    character: "Características especiais ou variação do produto.",
    moldes: "Quantidade de moldes necessários para produção.",
    status: "Define se o produto está ativo ou descontinuado."
  },

  // ==================== MACHINE ====================
  machine: {
    name: "Nome ou identificação da máquina.",
    manufacturer: "Fabricante/marca da máquina.",
    brand: "Marca ou modelo específico.",
    model: "Modelo da máquina.",
    sector: "Setor onde a máquina está localizada.",
    description: "Descrição detalhada da máquina e suas funcionalidades.",
    location_id: "Localização física onde a máquina está posicionada.",
    status: "Define se a máquina está ativa ou inativa."
  },

  // ==================== PROCEDURE ====================
  procedure: {
    name: "Nome do processo/procedimento.",
    hour_piquet: "Tempo em horas para produção em turno piquete.",
    hour_off_piquet: "Tempo em horas para produção fora do turno piquete.",
    status: "Define se o procedimento está ativo ou inativo."
  },

  // ==================== ORDER ====================
  order: {
    customer_id: "Selecione o cliente que está fazendo o pedido.",
    date: "Data em que o pedido foi realizado.",
    final_price: "Valor total do pedido em reais (calculado automaticamente).",
    finalPrice: "Valor total do pedido em reais (calculado automaticamente).",
    customerId: "Selecione o cliente que está fazendo o pedido.",
    discount: "Desconto aplicado ao total do pedido em reais.",
    products: "Produtos que compõem este pedido."
  },

  // ==================== MATERIAL ORDER ====================
  materialOrder: {
    date: "Data de recebimento do material.",
    amount: "Quantidade de material recebido.",
    unit: "Unidade de medida (kg, unidades, metros, etc).",
    storage_location: "Local onde o material será armazenado.",
    received_by: "Nome da pessoa que recebeu o material.",
    product_id: "Produto/material que está sendo recebido.",
    vendor_id: "Fornecedor de quem o material foi comprado."
  },

  // ==================== PRODUCT RETURN ====================
  productReturn: {
    order_id: "Pedido ao qual esta devolução está relacionada.",
    date: "Data em que a devolução foi realizada.",
    return_reason: "Motivo pelo qual o produto está sendo devolvido.",
    storage_location: "Local registrado no sistema onde o produto devolvido será armazenado.",
    replacement_necessary: "Indica se será necessário enviar um produto substituto.",
    resold: "Indica se o produto devolvido foi revendido.",
    products: "Produtos devolvidos vinculados a esta devolução.",
    opened: "Indica se a embalagem do produto devolvido foi aberta."
  },

  // ==================== PAYMENT ====================
  payment: {
    order_id: "Pedido ao qual este pagamento está relacionado.",
    date: "Data em que o pagamento foi realizado.",
    amount_paid: "Valor pago neste pagamento em reais.",
    remaining: "Valor restante a ser pago em reais.",
    payment_method: "Forma de pagamento utilizada (PIX, cartão, boleto, etc)."
  },

  // ==================== USER ====================
  user: {
    name: "Nome do usuário que será exibido no sistema.",
    email: "E-mail usado para login no sistema.",
    password: "Senha com no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.",
    access_level: "Define o nível de acesso do usuário (Administrador ou Padrão)."
  },

  // ==================== PRICE ====================
  price: {
    customer_id: "Cliente para o qual este preço especial se aplica.",
    product_id: "Produto ao qual este preço se aplica.",
    price: "Valor do preço especial em reais."
  },

  // ==================== MESSAGE CONFIG ====================
  messageConfig: {
    message_type: "Tipo de mensagem (WhatsApp, SMS, etc).",
    template: "Modelo da mensagem que será enviada.",
    schedule: "Agendamento para envio automático da mensagem."
  },

  // ==================== INVOICE ====================
  invoice: {
    order_id: "Pedido ao qual esta nota fiscal está vinculada.",
    invoice_number: "Número da nota fiscal.",
    issue_date: "Data de emissão da nota fiscal.",
    value: "Valor total da nota fiscal."
  },

  // ==================== PACKAGING ====================
  packaging: {
    name: "Nome ou identificação da embalagem.",
    quantity: "Quantidade de embalagens disponíveis.",
    storage_location: "Local onde as embalagens estão armazenadas."
  },

  // ==================== DELIVERY ====================
  delivery: {
    delivery_date: "Data prevista ou realizada da entrega.",
    status: "Status atual da entrega.",
    notes: "Observações sobre a entrega."
  },

  // ==================== DELIVERY PACKAGING ====================
  deliveryPackaging: {
    delivery_id: "Entrega à qual esta embalagem está associada.",
    packaging_id: "Embalagem que será utilizada na entrega.",
    quantity: "Quantidade de embalagens utilizadas."
  },

  // ==================== CUSTOMER PACKAGING ====================
  customerPackaging: {
    customer_id: "Cliente associado à embalagem.",
    packaging_id: "Embalagem associada ao cliente.",
    pontalti_brand: "Indica se a embalagem usa a marca Pontalti."
  },

  // ==================== STOCK ====================
  stock: {
    product_id: "Produto em estoque.",
    location_id: "Localização física do estoque.",
    quantity: "Quantidade disponível em estoque."
  },

  // ==================== PRODUCTION CONTROL ====================
  productionControl: {
    order_id: "Pedido que está sendo produzido.",
    status: "Status atual da produção.",
    material_disponibility: "Disponibilidade de material para produção."
  },

  // ==================== SALES FORECAST ====================
  salesForecast: {
    customer_id: "Cliente para quem a previsão se aplica.",
    product_id: "Produto da previsão de venda.",
    quantity: "Quantidade prevista para venda.",
    frequency_days: "Frequência em dias entre as vendas.",
    next_estimated_date: "Próxima data estimada de venda.",
    status: "Status da previsão (ativa, pausada, etc).",
    reason: "Motivo ou observações sobre a previsão."
  },

  // ==================== EXPENSE ====================
  expense: {
    amount: "Valor da despesa em reais.",
    classification: "Classificação/categoria da despesa.",
    description: "Descrição detalhada da despesa.",
    justification: "Justificativa para a despesa.",
    expense_date: "Data em que a despesa ocorreu.",
    requires_reimbursement: "Indica se a despesa precisa ser reembolsada.",
    applies_all_products: "Indica se a despesa se aplica a todos os produtos.",
    applies_all_machines: "Indica se a despesa se aplica a todas as máquinas.",
    actor_type: "Tipo de ator (funcionário, fornecedor, cliente).",
    actor_id: "Pessoa relacionada à despesa."
  },

  // ==================== LABEL PRINT ====================
  labelPrint: {
    order_id: "Pedido para o qual a etiqueta será impressa."
  },

  // ==================== VACATION ====================
  vacation: {
    employee_id: "Funcionário que tirará férias.",
    start_date: "Data de início das férias.",
    end_date: "Data de término das férias.",
    sold_days: "Quantidade de dias de férias vendidos."
  },

  // ==================== LOCATION ====================
  location: {
    name: "Nome ou identificação da localização.",
    description: "Descrição da localização e seu uso.",
    color: "Cor para identificação visual da localização.",
    position_x: "Posição horizontal no mapa da fábrica.",
    position_y: "Posição vertical no mapa da fábrica."
  },

  // ==================== TIME CONFIGURATION ====================
  timeConfiguration: {
    day_of_week: "Dia da semana para esta configuração de horário.",
    work_start: "Horário de início do expediente. Formato: HH:mm",
    work_end: "Horário de término do expediente. Formato: HH:mm",
    late_limit_in_minutes: "Tolerância máxima de atraso em minutos."
  },

  // ==================== TIME ADJUSTMENT REQUEST ====================
  timeAdjustmentRequest: {
    request_date: "Data para a qual o ajuste de horas está sendo solicitado.",
    hours_delta: "Quantidade de horas. Positivo para adicionar, negativo para remover.",
    reason: "Justificativa detalhada para o ajuste solicitado.",
    admin_comment: "Comentário obrigatório ao aprovar ou rejeitar."
  }
};

// Helper function to get help text
export function getHelpText(entity: keyof typeof fieldHelpTexts, field: string): string | undefined {
  const entityTexts = fieldHelpTexts[entity];
  if (entityTexts && field in entityTexts) {
    return (entityTexts as Record<string, string>)[field];
  }
  return undefined;
}
