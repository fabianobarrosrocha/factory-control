/**
 * Traduções de typeRegister (inglês) para português
 * Usado para exibir nomes em português nos botões e títulos do sistema
 */

export const typeRegisterTranslations: Record<string, string> = {
  Customer: "Cliente",
  Employee: "Funcionário",
  Machine: "Máquina",
  Procedure: "Procedimento",
  Product: "Produto",
  Vendor: "Fornecedor",
  Vacation: "Férias",
  Order: "Pedido",
  MaterialOrder: "Material Produtivo",
  ProductReturn: "Devolução",
  Payment: "Pagamento",
  User: "Usuário",
  Price: "Preço",
  MessageConfig: "Configuração de Mensagem",
  Invoice: "Nota Fiscal",
  Packaging: "Embalagem",
  Delivery: "Entrega",
  DeliveryPackaging: "Embalagem de Entrega",
  CustomerPackaging: "Embalagem do Cliente",
  Stock: "Estoque",
  ProductionControl: "Controle de Produção",
  SalesForecast: "Previsão de Vendas",
  Expense: "Despesa",
  LabelPrint: "Impressão de Etiqueta",
  Location: "Localização",
  TimeConfiguration: "Configuração de Tempo",
  TimeAdjustmentRequest: "Solicitação de Ajuste de Horas",
  Color: "Cor",
  Foam: "Espuma",
  Mold: "Molde"
};

/**
 * Retorna a tradução para português de um typeRegister
 * Se não encontrar, retorna o próprio valor
 */
export function getTypeRegisterTranslation(typeRegister: string): string {
  return typeRegisterTranslations[typeRegister] || typeRegister;
}
