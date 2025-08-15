import {
  Badge,
  Box,
  Card,
  Group,
  Image,
  NumberFormatter,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { Suspense } from "react";

import { useCategoryDetailsLoaderData } from "#/routes/private/category-details";

import { CurrencyFormatter } from "../currency-formatter";
import { CategoryCardSkeleton } from "../overview/category-card";
import { Section } from "../section";

interface StatItemProps {
  label: string;
  value: number;
  color?: string;
  prefix?: string;
  allowNegative?: boolean;
}

// Components
function StatItem({
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

export default function FundPerformance() {
  const { schemes } = useCategoryDetailsLoaderData();

  return (
    <Section title="Fund Performance">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(4).keys()).map((item) => (
            <CategoryCardSkeleton key={item} />
          ))}
        ></Suspense>
        {schemes.map((scheme) => {
          const isPositive = scheme.returns > 0;
          const returnColor = isPositive ? "teal" : "red";
          const progressValue =
            scheme.invested > 0
              ? ((scheme.current - scheme.invested) / scheme.invested) * 100
              : 0;

          return (
            <Card key={scheme.scheme_name} withBorder>
              <Stack gap="md">
                <Group align="flex-start" wrap="nowrap" gap="xs">
                  <ThemeIcon variant="default" size="md">
                    <Image
                      loading="lazy"
                      src={scheme.logo}
                      alt={scheme.scheme_name as string}
                      w="auto"
                      h={14}
                    />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" lineClamp={1}>
                      {scheme.scheme_name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {scheme.sub_category}
                    </Text>
                  </Box>
                  <Tooltip label="Returns percentage">
                    <Badge
                      ml="auto"
                      variant="light"
                      color={returnColor}
                      size="sm"
                      style={{ flexShrink: 0 }}
                    >
                      <NumberFormatter
                        value={scheme.returns_percentage}
                        suffix="%"
                        decimalScale={2}
                        allowNegative={false}
                        prefix={isPositive ? "+" : "-"}
                      />
                    </Badge>
                  </Tooltip>
                </Group>
                <Progress
                  value={progressValue}
                  color={returnColor}
                  size="sm"
                  radius="xl"
                />
                <SimpleGrid cols={2} spacing="sm">
                  <StatItem label="Current" value={scheme.current} />
                  <StatItem label="Invested" value={scheme.invested} />
                  <StatItem
                    label="Returns"
                    value={scheme.returns}
                    color={returnColor}
                    prefix={isPositive ? "+" : "-"}
                    allowNegative={false}
                  />
                  <StatItem
                    label="Monthly SIP"
                    value={Number(scheme.monthly_sip)}
                  />
                </SimpleGrid>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Section>
  );
}
