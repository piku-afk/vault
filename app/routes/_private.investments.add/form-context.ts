import { createFormContext } from '@mantine/form';
import dayjs from 'dayjs';
import z from 'zod';

export const transactionSchema = z.object({
  date: z.string().refine((val) => dayjs(val, 'YYYY-MM-DD', true).isValid(), {
    message: 'Invalid date format. Use YYYY-MM-DD',
  }),
  transaction_type: z.string(),
  fund_name: z.string(),
  units: z.coerce.number().positive(),
  nav: z.coerce.number().positive(),
  amount: z.coerce.number().positive(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export const [TransactionFormProvider, useTransactionFormContext, useTransactionForm] =
  createFormContext<TransactionFormValues>();
