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
          const investmentSummary = [
            { label: "Current", value: scheme.current },
            { label: "Invested", value: scheme.invested },
            { label: "Returns", value: scheme.returns },
            { label: "Monthly SIP", value: scheme.sip_amount },
          ];
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
                  {investmentSummary.map((summaryItem) => (
                    <Box key={summaryItem.label}>
                      <Text size="xs" c="dimmed" mb={2}>
                        {summaryItem.label}
                      </Text>
                      <Text fw={500} size="sm">
                        <CurrencyFormatter
                          value={summaryItem.value}
                          // prefix={summaryItem.label === "Current" ? "$" : ""}
                          allowNegative={false}
                        />
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Section>
  );
}
