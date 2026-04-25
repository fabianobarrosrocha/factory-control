import VMasker from "vanilla-masker";

const onlyDigits = (value?: string | number | null) => String(value ?? "").replace(/\D/g, "");

export const formatPhone = (value?: string | number | null) => {
  const digits = onlyDigits(value);
  if (!digits) return "Não informado";
  return VMasker.toPattern(digits, "(99) 9999-9999");
};

export const formatCellPhone = (value?: string | number | null) => {
  const digits = onlyDigits(value);
  if (!digits) return "Não informado";
  return VMasker.toPattern(digits, "(99) 99999-9999");
};

export const formatCpf = (value?: string | number | null) => {
  const digits = onlyDigits(value);
  if (!digits) return "Não informado";
  return VMasker.toPattern(digits, "999.999.999-99");
};

export const formatCnpj = (value?: string | number | null) => {
  const digits = onlyDigits(value);
  if (!digits) return "Não informado";
  return VMasker.toPattern(digits, "99.999.999/9999-99");
};

export const formatCpfCnpj = (cpf?: string | number | null, cnpj?: string | number | null) => {
  if (onlyDigits(cnpj)) return formatCnpj(cnpj);
  return formatCpf(cpf);
};
