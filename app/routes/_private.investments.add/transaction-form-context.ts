import { createFormContext } from "@mantine/form";
import dayjs from "dayjs";
import z from "zod";

const dateSchema = z
  .string()
  .refine((val) => dayjs(val, "YYYY-MM-DD", true).isValid(), {
    message: "Invalid date format. Use YYYY-MM-DD",
  });

export const transactionSchema = z.object({
  group_date: dateSchema.optional(),
  group_fund_name: z.string().optional(),
  group_transaction_type: z.string().optional(),
  transactions: z.array(
    z.object({
      date: dateSchema,
      transaction_type: z.string(),
      fund_name: z.string(),
      units: z.coerce.number().positive(),
      nav: z.coerce.number().positive(),
      amount: z.coerce.number().positive(),
    }),
  ),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export const [
  TransactionFormProvider,
  useTransactionFormContext,
  useTransactionForm,
] = createFormContext<TransactionFormValues>();
