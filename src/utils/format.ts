export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatDateLong(dateString: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function truncateId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function convertToNaira(
  usdAmount: number,
  rate: number | null,
): number | null {
  if (rate === null) return null;
  return usdAmount * rate;
}

export function formatNairaFromUsd(
  usdAmount: number,
  rate: number | null,
): string {
  const naira = convertToNaira(usdAmount, rate);
  if (naira === null) return "...";
  return formatNaira(naira);
}
