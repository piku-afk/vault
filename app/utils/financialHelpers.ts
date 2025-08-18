import dayjs, { type Dayjs } from "dayjs";

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

/**
 * Get the appropriate color for goal progress
 */
export function getGoalColor(progress: number, isComplete: boolean) {
  if (isComplete) return "teal";
  if (progress > 75) return "yellow";
  return progress > 50 ? "blue" : "red";
}

export function getGoalCompletionDate(
  remaining: number,
  monthlyContribution: number,
): Dayjs {
  if (remaining === 0) return dayjs();

  return dayjs().add(Math.ceil(remaining / monthlyContribution), "months");
}
