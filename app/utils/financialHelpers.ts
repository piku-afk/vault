export interface FinancialData {
  current: number;
  invested: number;
  returns: number;
}

/**
 * Calculate the progress percentage based on returns
 */
export function calculateProgressValue(data: FinancialData): number {
  return data.invested > 0
    ? ((data.current - data.invested) / data.invested) * 100
    : 0;
}

/**
 * Determine if returns are positive
 */
export function isPositiveReturns(returns: number): boolean {
  return returns > 0;
}

/**
 * Get the appropriate color for returns
 */
export function getReturnsColor(returns: number): "teal" | "red" {
  return returns > 0 ? "teal" : "red";
}

/**
 * Get the appropriate prefix for returns
 */
export function getReturnsPrefix(returns: number): "+" | "-" {
  return returns > 0 ? "+" : "-";
}

/**
 * Format scheme count with proper singular/plural
 */
export function formatSchemeCount(count: number): string {
  return `${count} ${count === 1 ? "Scheme" : "Schemes"}`;
}
