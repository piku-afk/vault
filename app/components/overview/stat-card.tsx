import { Card, Group, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import type { LucideIcon } from "lucide-react";

import { CurrencyFormatter } from "#/components/currency-formatter";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  isCurrency?: boolean;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  isCurrency,
}: StatCardProps) {
  return (
    <Card withBorder>
      <Group gap="sm" align="flex-start">
        <ThemeIcon mt={2} variant="default" size="lg">
          <Icon size={18} />
        </ThemeIcon>
        <Stack gap={2}>
          <Text size="xl" fw={500}>
            {isCurrency ? <CurrencyFormatter value={value} /> : value}
          </Text>
          <Text size="xs" c="dimmed">
            {label}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card withBorder>
      <Group gap="sm" align="flex-start">
        <Skeleton height={40} width={40} mt={2} />
        <Stack gap={14}>
          <Skeleton height={25} width={80} />
          <Skeleton height={12} width={100} />
        </Stack>
      </Group>
    </Card>
  );
}
