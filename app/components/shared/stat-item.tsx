import { Box, Text } from "@mantine/core";

import { CurrencyFormatter } from "./currency-formatter";

export interface StatItemProps {
  label: string;
  value: number;
  color?: string;
  prefix?: string;
  allowNegative?: boolean;
}

export function StatItem({
  label,
  value,
  color,
  prefix,
  allowNegative = true,
}: StatItemProps) {
  return (
    <Box>
      <Text size="xs" c="dimmed" mb={2}>
        {label}
      </Text>
      <Text fw={500} size="sm" c={color}>
        <CurrencyFormatter
          value={value}
          prefix={prefix}
          allowNegative={allowNegative}
        />
      </Text>
    </Box>
  );
}
