export function normalizeCardNumber(value: string) {
  return value.replace(/\D/g, '');
}
export function normalizeIban(value: string) {
  return value.replace(/\s/g, '').toUpperCase();
}
export function isValidIranianCard(value: string) {
  const number = normalizeCardNumber(value);
  if (!/^\d{16}$/.test(number) || /^([0-9])\1{15}$/.test(number)) return false;
  const sum = [...number].reduce((total, digit, index) => {
    const product = Number(digit) * (index % 2 === 0 ? 2 : 1);
    return total + (product > 9 ? product - 9 : product);
  }, 0);
  return sum % 10 === 0;
}
export function isValidIranianIban(value: string) {
  const iban = normalizeIban(value);
  if (!/^IR\d{24}$/.test(iban)) return false;
  const rearranged = `${iban.slice(4)}1827${iban.slice(2, 4)}`;
  let remainder = 0;
  for (const digit of rearranged) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}
