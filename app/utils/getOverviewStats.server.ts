import { sql } from 'kysely';

import { db } from './kysely.server';

export async function getRecentTransactions(limit: number = 10) {
  const transactions = await db
    .selectFrom('transactions')
    .innerJoin('mutual_fund_schemes', 'transactions.scheme_name', 'mutual_fund_schemes.scheme_name')
    .select([
      'transactions.id',
      'transactions.date',
      'transactions.amount',
      'transactions.transaction_type',
      'transactions.scheme_name',
      'transactions.units',
      'transactions.nav',
      'mutual_fund_schemes.saving_category',
    ])
    .orderBy('transactions.date', 'desc')
    .orderBy('transactions.updated_at', 'desc')
    .limit(limit)
    .execute();

  return transactions;
}

export async function getQuickStats() {
  // Get total unique schemes
  const totalSchemes = await db
    .selectFrom('transactions')
    .select([sql<number>`COUNT(DISTINCT scheme_name)`.as('count')])
    .executeTakeFirst();

  // Get monthly SIP (average monthly investment from last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlySip = await db
    .selectFrom('transactions')
    .select([sql<number>`AVG(amount)`.as('average')])
    .where('transaction_type', '=', 'Purchase')
    .where('date', '>=', sixMonthsAgo.toISOString().split('T')[0])
    .executeTakeFirst();

  // Get days since last transaction
  const lastTransaction = await db
    .selectFrom('transactions')
    .select('date')
    .orderBy('date', 'desc')
    .executeTakeFirst();

  const daysSinceLastTransaction = lastTransaction
    ? Math.floor((Date.now() - new Date(lastTransaction.date).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return {
    totalSchemes: totalSchemes?.count || 0,
    averageMonthlySip: monthlySip?.average || 0,
    daysSinceLastTransaction,
  };
}
