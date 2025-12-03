export function isValidEmail(email) {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
}

export const formatCurrency = (value) => {
  const amount = Number(value);
  const safeNumber = Number.isFinite(amount) ? amount : 0;
  const [whole, decimal] = safeNumber.toFixed(2).split('.');
  const withThousands = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${withThousands}.${decimal}`;
}
