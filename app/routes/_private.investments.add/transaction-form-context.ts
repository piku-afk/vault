import { createFormContext } from '@mantine/form';
import dayjs from 'dayjs';
import z from 'zod';

const dateSchema = z.string().refine((val) => dayjs(val, 'YYYY-MM-DD', true).isValid(), {
  message: 'Invalid date format. Use YYYY-MM-DD',
});

const transactionSchema = z.object({
  date: dateSchema.refine((val) => !!val, { message: 'Transaction Date is required' }),
  transaction_type: z
    .string()
    .default('')
    .refine((value) => !!value, { message: 'Transaction type is required' }),
  fund_name: z
    .string()
    .default('')
    .refine((value) => !!value, { message: 'Fund name is required' }),
  units: z
    .string()
    .default('')
    .refine((value) => !!value, { message: 'Units are required' }),
  nav: z
    .string()
    .default('')
    .refine((value) => !!value, { message: 'NAV is required' }),
  amount: z
    .string()
    .default('')
    .refine((value) => !!value, { message: 'Amount is required' }),
});

export const transactionFormSchema = z.object({
  group_date: dateSchema.nullable(),
  group_fund_name: z.string().nullable().nullable(),
  group_transaction_type: z.string().nullable().nullable(),
  transactions: z.array(transactionSchema),
});

type Transaction = z.infer<typeof transactionSchema>;

export const defaultTransaction: Transaction = {
  date: '',
  transaction_type: '',
  fund_name: '',
  units: '',
  nav: '',
  amount: '',
};

export const defaultTransactionFormValues: z.infer<typeof transactionFormSchema> = {
  group_date: null,
  group_fund_name: null,
  group_transaction_type: null,
  transactions: [defaultTransaction],
};

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const [TransactionFormProvider, useTransactionFormContext, useTransactionForm] =
  createFormContext<TransactionFormValues>();
