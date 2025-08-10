import dayjs from 'dayjs';
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
  const totalSchemes = await db
    .selectFrom('mutual_fund_summary')
    .select([sql<number>`COUNT(DISTINCT scheme_name)`.as('count')])
    .executeTakeFirst();

  const monthlySip = await db
    .selectFrom('mutual_fund_schemes')
    .select(sql<number>`SUM(sip_amount)`.as('total'))
    .where('is_active', '=', true)
    .executeTakeFirst();

  const lastTransaction = await db
    .selectFrom('mutual_fund_schemes')
    .select('next_sip_date')
    .orderBy('next_sip_date', 'asc')
    .executeTakeFirst();

  const daysTillNextTransaction = dayjs(lastTransaction?.next_sip_date).diff(dayjs(), 'day') + 1;

  return {
    totalSchemes: totalSchemes?.count || 0,
    monthlySip: monthlySip?.total || 0,
    daysTillNextTransaction,
  };
}
