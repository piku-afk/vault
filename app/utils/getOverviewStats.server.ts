import { sql } from 'kysely';

import { db } from './kysely.server';

export async function getRecentTransactions() {
  return db
    .selectFrom('transactions as t')
    .innerJoin('mutual_fund_schemes as mfs', 't.scheme_name', 'mfs.scheme_name')
    .select([
      't.id',
      't.date',
      't.amount',
      't.transaction_type',
      't.scheme_name',
      't.units',
      't.nav',
      'mfs.logo',
      'mfs.saving_category',
    ])
    .orderBy('t.date', 'desc')
    .orderBy('t.updated_at', 'desc')
    .limit(8)
    .execute();
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
