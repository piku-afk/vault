import { Badge, Box, Group, Image, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { TRANSACTION_TYPE } from "#/constants/transaction_type";
import type { getRecentTransactions } from "#/utils/getOverviewStats.server";

type Transactions = Awaited<ReturnType<typeof getRecentTransactions>>;
type Transaction = Transactions[number];

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isPurchase = transaction.transaction_type === TRANSACTION_TYPE.PURCHASE;

  return (
    <Group align="flex-start" wrap="nowrap">
      {transaction.logo && (
        <Image
          radius="md"
          w="auto"
          h={28}
          mt={2}
          src={transaction.logo}
          alt={transaction.scheme_name}
        />
      )}
      <Box>
        <Text fw={500} size="sm" lineClamp={1}>
          {transaction.scheme_name}
        </Text>
        <Group gap="xs" mt={6} wrap="wrap">
          <Badge variant="light" color="gray" size="xs">
            {transaction.saving_category}
          </Badge>
          <Text size="xs" c="dimmed">
            {dayjs(transaction.date).format("DD MMM, YYYY")}
          </Text>
        </Group>
      </Box>
      <Stack ml="auto" gap={6} ta="right" style={{ flexShrink: 0 }}>
        <Text fw={500} size="sm">
          {isPurchase ? "+" : "-"}
          <CurrencyFormatter value={transaction.amount} />
        </Text>
        <Text size="xs" c="dimmed">
          {transaction.units} units
        </Text>
      </Stack>
    </Group>
  );
}
