import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  NumberFormatter,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  BarChart3,
  Filter,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { Section } from "#/components/section";
import {
  getInvestmentData,
  getInvestmentDataBySavingsCategory,
} from "#/utils/getInvestment.server";

import type { Route } from "./+types/investments";

export async function loader() {
  return {
    funds: await getInvestmentData(),
    fundsByCategory: await getInvestmentDataBySavingsCategory(),
  };
}

export default function Investments({ loaderData }: Route.ComponentProps) {
  const { funds, fundsByCategory } = loaderData;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate overall portfolio stats
  const portfolioStats = funds.reduce(
    (acc, fund) => ({
      totalInvested: acc.totalInvested + fund.invested,
      totalCurrent: acc.totalCurrent + fund.current,
      totalReturns: acc.totalReturns + fund.returns,
      totalSchemes: acc.totalSchemes + 1,
    }),
    { totalInvested: 0, totalCurrent: 0, totalReturns: 0, totalSchemes: 0 },
  );

  const overallReturnsPercentage =
    portfolioStats.totalInvested > 0
      ? Number(
          (portfolioStats.totalReturns / portfolioStats.totalInvested) * 100,
        ) || 0
      : 0;
  const isOverallPositive = portfolioStats.totalReturns > 0;

  // Filter functions
  const filteredFunds = funds.filter((fund) => {
    const matchesSearch = fund.scheme_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredCategories = fundsByCategory.filter((category) => {
    if (!selectedCategory) return true;
    return category.name === selectedCategory;
  });

  const categoryOptions = fundsByCategory.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <Stack gap="xl">
      {/* Portfolio Overview Header */}
      <Card
        withBorder
        radius="lg"
        p="xl"
        bg="gradient-to-r from-violet-50 to-blue-50"
      >
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2} fw={700} c="violet.8" mb="xs">
                Investment Portfolio
              </Title>
              <Text c="dimmed" size="sm">
                Track and manage your mutual fund investments
              </Text>
            </div>
            <Button
              component={Link}
              to="/investments/add"
              leftSection={<Plus size={16} />}
              variant="gradient"
              gradient={{ from: "violet", to: "blue" }}
              size="md"
              radius="md"
            >
              Add Investment
            </Button>
          </Group>

          {/* Portfolio Stats Cards */}
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            <Card withBorder radius="md" p="md" bg="white">
              <Group gap="sm">
                <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                  <Wallet size={20} />
                </ThemeIcon>
                <div>
                  <Text size="lg" fw={700} c="blue.7">
                    <CurrencyFormatter value={portfolioStats.totalInvested} />
                  </Text>
                  <Text size="xs" c="dimmed">
                    Total Invested
                  </Text>
                </div>
              </Group>
            </Card>

            <Card withBorder radius="md" p="md" bg="white">
              <Group gap="sm">
                <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                  <TrendingUp size={20} />
                </ThemeIcon>
                <div>
                  <Text size="lg" fw={700} c="teal.7">
                    <CurrencyFormatter value={portfolioStats.totalCurrent} />
                  </Text>
                  <Text size="xs" c="dimmed">
                    Current Value
                  </Text>
                </div>
              </Group>
            </Card>

            <Card withBorder radius="md" p="md" bg="white">
              <Group gap="sm">
                <ThemeIcon
                  variant="light"
                  color={isOverallPositive ? "green" : "red"}
                  size="lg"
                  radius="md"
                >
                  {isOverallPositive ? (
                    <TrendingUp size={20} />
                  ) : (
                    <TrendingDown size={20} />
                  )}
                </ThemeIcon>
                <div>
                  <Text
                    size="lg"
                    fw={700}
                    c={isOverallPositive ? "green.7" : "red.7"}
                  >
                    {isOverallPositive ? "+" : ""}
                    <CurrencyFormatter value={portfolioStats.totalReturns} />
                  </Text>
                  <Text size="xs" c="dimmed">
                    Total Returns
                  </Text>
                </div>
              </Group>
            </Card>

            <Card withBorder radius="md" p="md" bg="white">
              <Group gap="sm">
                <ThemeIcon variant="light" color="violet" size="lg" radius="md">
                  <BarChart3 size={20} />
                </ThemeIcon>
                <div>
                  <Text size="lg" fw={700} c="violet.7">
                    {portfolioStats.totalSchemes}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Active Schemes
                  </Text>
                </div>
              </Group>
            </Card>
          </SimpleGrid>

          {/* Overall Performance Indicator */}
          <Card withBorder radius="md" p="md" bg="white">
            <Group justify="space-between" align="center">
              <Text fw={600} size="md">
                Overall Portfolio Performance
              </Text>
              <Group gap="md" align="center">
                <Badge
                  variant="light"
                  color={isOverallPositive ? "teal" : "red"}
                  size="xl"
                  radius="md"
                >
                  {isOverallPositive ? "+" : ""}
                  {(Number(overallReturnsPercentage) || 0).toFixed(2)}%
                </Badge>
                <Progress
                  value={Math.min(Math.abs(overallReturnsPercentage), 50)}
                  color={isOverallPositive ? "teal" : "red"}
                  size="lg"
                  radius="xl"
                  style={{ width: "150px" }}
                />
              </Group>
            </Group>
          </Card>
        </Stack>
      </Card>

      {/* Search and Filter Bar */}
      <Card withBorder radius="lg" p="md">
        <Group justify="space-between" align="center">
          <Group gap="md" style={{ flex: 1 }}>
            <TextInput
              placeholder="Search schemes..."
              leftSection={<Search size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              style={{ flex: 1, maxWidth: "400px" }}
              radius="md"
            />
            <Select
              placeholder="Filter by category"
              leftSection={<Filter size={16} />}
              data={[
                { value: "", label: "All Categories" },
                ...categoryOptions,
              ]}
              value={selectedCategory || ""}
              onChange={(value) => setSelectedCategory(value || null)}
              clearable
              style={{ width: "200px" }}
              radius="md"
            />
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {filteredFunds.length} of {funds.length} schemes
            </Text>
          </Group>
        </Group>
      </Card>

      {/* Performance Analytics */}
      <Section title="Performance Analytics">
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {/* Top Performer */}
          <Card
            withBorder
            radius="lg"
            p="lg"
            bg="gradient-to-br from-green-50 to-green-100"
          >
            <Stack gap="md">
              <Group gap="sm">
                <ThemeIcon variant="light" color="green" size="lg" radius="md">
                  <TrendingUp size={20} />
                </ThemeIcon>
                <Text fw={600} size="lg" c="green.8">
                  Top Performer
                </Text>
              </Group>
              {filteredFunds.length > 0 ? (
                (() => {
                  const topPerformer = filteredFunds.reduce((best, current) =>
                    (Number(current.returns_percentage) || 0) >
                    (Number(best.returns_percentage) || 0)
                      ? current
                      : best,
                  );
                  return (
                    <div>
                      <Text fw={500} size="sm" lineClamp={2} mb="xs">
                        {topPerformer.scheme_name}
                      </Text>
                      <Group justify="space-between">
                        <Text size="lg" fw={700} c="green.7">
                          +<CurrencyFormatter value={topPerformer.returns} />
                        </Text>
                        <Badge variant="filled" color="green" size="lg">
                          +
                          {(
                            Number(topPerformer.returns_percentage) || 0
                          ).toFixed(1)}
                          %
                        </Badge>
                      </Group>
                    </div>
                  );
                })()
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="lg">
                  No data available
                </Text>
              )}
            </Stack>
          </Card>

          {/* Worst Performer */}
          <Card
            withBorder
            radius="lg"
            p="lg"
            bg="gradient-to-br from-red-50 to-red-100"
          >
            <Stack gap="md">
              <Group gap="sm">
                <ThemeIcon variant="light" color="red" size="lg" radius="md">
                  <TrendingDown size={20} />
                </ThemeIcon>
                <Text fw={600} size="lg" c="red.8">
                  Needs Attention
                </Text>
              </Group>
              {filteredFunds.length > 0 ? (
                (() => {
                  const worstPerformer = filteredFunds.reduce(
                    (worst, current) =>
                      (Number(current.returns_percentage) || 0) <
                      (Number(worst.returns_percentage) || 0)
                        ? current
                        : worst,
                  );
                  return (
                    <div>
                      <Text fw={500} size="sm" lineClamp={2} mb="xs">
                        {worstPerformer.scheme_name}
                      </Text>
                      <Group justify="space-between">
                        <Text size="lg" fw={700} c="red.7">
                          <CurrencyFormatter value={worstPerformer.returns} />
                        </Text>
                        <Badge variant="filled" color="red" size="lg">
                          {(
                            Number(worstPerformer.returns_percentage) || 0
                          ).toFixed(1)}
                          %
                        </Badge>
                      </Group>
                    </div>
                  );
                })()
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="lg">
                  No data available
                </Text>
              )}
            </Stack>
          </Card>

          {/* Investment Distribution */}
          <Card
            withBorder
            radius="lg"
            p="lg"
            bg="gradient-to-br from-blue-50 to-blue-100"
          >
            <Stack gap="md">
              <Group gap="sm">
                <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                  <BarChart3 size={20} />
                </ThemeIcon>
                <Text fw={600} size="lg" c="blue.8">
                  Portfolio Health
                </Text>
              </Group>
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Positive vs Negative Returns
                </Text>
                {filteredFunds.length > 0 ? (
                  (() => {
                    const positiveCount = filteredFunds.filter(
                      (f) => f.returns > 0,
                    ).length;
                    const positivePercentage =
                      (positiveCount / filteredFunds.length) * 100;
                    return (
                      <Group justify="space-between" align="center">
                        <Progress
                          value={positivePercentage}
                          color="teal"
                          size="lg"
                          radius="xl"
                          style={{ flex: 1 }}
                        />
                        <Text fw={600} c="blue.7">
                          {positiveCount}/{filteredFunds.length}
                        </Text>
                      </Group>
                    );
                  })()
                ) : (
                  <Text size="sm" c="dimmed" ta="center">
                    No data available
                  </Text>
                )}
                <Text size="xs" c="dimmed" mt="xs">
                  {filteredFunds.length > 0
                    ? `${Math.round((filteredFunds.filter((f) => f.returns > 0).length / filteredFunds.length) * 100)}% of schemes are profitable`
                    : "Portfolio health will be shown when data is available"}
                </Text>
              </div>
            </Stack>
          </Card>
        </SimpleGrid>
      </Section>

      {/* Funds by Category - Enhanced Card Layout */}
      <Section title="Funds by Savings Category">
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
          {filteredCategories.map((category) => {
            const schemes = category.schemes || [];
            const categoryTotals = schemes.reduce(
              (
                acc: { invested: number; current: number; returns: number },
                scheme: {
                  invested?: number;
                  current?: number;
                  returns?: number;
                },
              ) => ({
                invested: acc.invested + (scheme.invested || 0),
                current: acc.current + (scheme.current || 0),
                returns: acc.returns + (scheme.returns || 0),
              }),
              { invested: 0, current: 0, returns: 0 },
            );

            const categoryReturnsPercentage =
              categoryTotals.invested > 0
                ? (categoryTotals.returns / categoryTotals.invested) * 100
                : 0;

            const categoryIsPositive = categoryTotals.returns > 0;
            const progressValue =
              categoryTotals.invested > 0
                ? Math.min(
                    (categoryTotals.current / categoryTotals.invested) * 100,
                    150,
                  )
                : 0;

            return (
              <Card
                key={category.name}
                withBorder
                radius="lg"
                p="lg"
                shadow="sm"
                style={{
                  background: categoryIsPositive
                    ? "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)"
                    : "linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%)",
                  borderColor: categoryIsPositive ? "#10b981" : "#ef4444",
                }}
              >
                <Stack gap="md">
                  {/* Enhanced Category Header */}
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Group gap="sm" mb="xs">
                        <ThemeIcon
                          variant="light"
                          color={categoryIsPositive ? "teal" : "red"}
                          size="md"
                          radius="md"
                        >
                          {categoryIsPositive ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                        </ThemeIcon>
                        <Title
                          order={3}
                          fw={600}
                          c={categoryIsPositive ? "teal.8" : "red.8"}
                        >
                          {category.name}
                        </Title>
                      </Group>
                      <Group gap="md">
                        <Text size="sm" c="dimmed">
                          {schemes.length} schemes
                        </Text>
                        <Badge variant="outline" color="gray" size="sm">
                          <CurrencyFormatter value={categoryTotals.invested} />
                        </Badge>
                      </Group>
                    </div>
                    <Badge
                      variant="filled"
                      color={categoryIsPositive ? "teal" : "red"}
                      size="xl"
                      radius="md"
                    >
                      <NumberFormatter
                        value={Math.abs(categoryReturnsPercentage)}
                        suffix="%"
                        decimalScale={1}
                        prefix={categoryIsPositive ? "+" : "-"}
                      />
                    </Badge>
                  </Group>

                  {/* Progress Bar */}
                  <Progress
                    value={progressValue}
                    color={categoryIsPositive ? "teal" : "red"}
                    size="sm"
                    radius="xl"
                  />

                  {/* Category Summary */}
                  <SimpleGrid cols={3} spacing="xs">
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Invested
                      </Text>
                      <Text fw={600} size="sm">
                        <CurrencyFormatter value={categoryTotals.invested} />
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Current
                      </Text>
                      <Text fw={600} size="sm">
                        <CurrencyFormatter value={categoryTotals.current} />
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Returns
                      </Text>
                      <Text
                        fw={600}
                        size="sm"
                        c={categoryIsPositive ? "teal.7" : "red.7"}
                      >
                        <CurrencyFormatter
                          value={Math.abs(categoryTotals.returns)}
                          prefix={categoryIsPositive ? "+₹" : "-₹"}
                        />
                      </Text>
                    </div>
                  </SimpleGrid>

                  <Divider />

                  {/* Schemes List */}
                  <Stack gap="sm">
                    <Text fw={500} size="sm" c="dimmed">
                      Individual Schemes
                    </Text>
                    {schemes.map(
                      (scheme: {
                        name: string;
                        invested?: number;
                        current?: number;
                        returns?: number;
                        returns_percentage?: number;
                      }) => {
                        const schemeIsPositive = (scheme.returns || 0) > 0;
                        return (
                          <Card
                            key={scheme.name}
                            withBorder
                            radius="md"
                            p="sm"
                            bg="gray.0"
                          >
                            <Group justify="space-between" align="flex-start">
                              <div style={{ flex: 1 }}>
                                <Text fw={500} size="sm" lineClamp={2}>
                                  {scheme.name}
                                </Text>
                                <Group gap="md" mt="xs">
                                  <Text size="xs" c="dimmed">
                                    Invested:{" "}
                                    <CurrencyFormatter
                                      value={scheme.invested || 0}
                                    />
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    Current:{" "}
                                    <CurrencyFormatter
                                      value={scheme.current || 0}
                                    />
                                  </Text>
                                </Group>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <Text
                                  fw={600}
                                  size="sm"
                                  c={schemeIsPositive ? "teal.7" : "red.7"}
                                >
                                  <CurrencyFormatter
                                    value={scheme.returns || 0}
                                  />
                                </Text>
                                <Text
                                  size="xs"
                                  c={schemeIsPositive ? "teal.6" : "red.6"}
                                >
                                  <NumberFormatter
                                    value={scheme.returns_percentage || 0}
                                    suffix="%"
                                    decimalScale={1}
                                    prefix={schemeIsPositive ? "+" : ""}
                                  />
                                </Text>
                              </div>
                            </Group>
                          </Card>
                        );
                      },
                    )}
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Section>

      <Divider />

      {/* Enhanced All Funds Table */}
      <Section title={`All Funds (${filteredFunds.length})`}>
        <Card withBorder radius="lg" p={0} style={{ overflow: "hidden" }}>
          <Table.ScrollContainer minWidth="48em">
            <Table highlightOnHover>
              <Table.Thead bg="gradient-to-r from-violet-50 to-blue-50">
                <Table.Tr>
                  <Table.Th style={{ fontWeight: 600, fontSize: "14px" }}>
                    Scheme Name
                  </Table.Th>
                  <Table.Th
                    ta="right"
                    style={{ fontWeight: 600, fontSize: "14px" }}
                  >
                    Current Value
                  </Table.Th>
                  <Table.Th
                    ta="right"
                    style={{ fontWeight: 600, fontSize: "14px" }}
                  >
                    Invested
                  </Table.Th>
                  <Table.Th
                    ta="right"
                    style={{ fontWeight: 600, fontSize: "14px" }}
                  >
                    Returns
                  </Table.Th>
                  <Table.Th
                    ta="right"
                    style={{ fontWeight: 600, fontSize: "14px" }}
                  >
                    Performance
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredFunds.length > 0 ? (
                  filteredFunds.map((fund) => {
                    const isPositive = fund.returns > 0;
                    return (
                      <Table.Tr
                        key={fund.scheme_name}
                        style={{
                          borderLeft: `3px solid ${isPositive ? "#10b981" : "#ef4444"}`,
                        }}
                      >
                        <Table.Td>
                          <div>
                            <Text fw={500} size="sm" lineClamp={2}>
                              {fund.scheme_name}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td ta="right">
                          <Text fw={600} size="sm">
                            <CurrencyFormatter value={fund.current} />
                          </Text>
                        </Table.Td>
                        <Table.Td ta="right">
                          <Text size="sm" c="dimmed">
                            <CurrencyFormatter value={fund.invested} />
                          </Text>
                        </Table.Td>
                        <Table.Td ta="right">
                          <Text
                            fw={600}
                            size="sm"
                            c={isPositive ? "teal.7" : "red.7"}
                          >
                            {isPositive ? "+" : ""}
                            <CurrencyFormatter value={fund.returns} />
                          </Text>
                        </Table.Td>
                        <Table.Td ta="right">
                          <Group gap="xs" justify="flex-end">
                            <Badge
                              variant="light"
                              color={isPositive ? "teal" : "red"}
                              size="sm"
                              radius="md"
                            >
                              {isPositive ? "+" : ""}
                              <NumberFormatter
                                value={fund.returns_percentage}
                                suffix="%"
                                decimalScale={2}
                              />
                            </Badge>
                            <Progress
                              value={Math.min(
                                Math.abs(fund.returns_percentage),
                                50,
                              )}
                              color={isPositive ? "teal" : "red"}
                              size="sm"
                              radius="xl"
                              style={{ width: "60px" }}
                            />
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={5} ta="center" py="xl">
                      <Stack gap="md" align="center">
                        <Search size={48} color="gray" />
                        <div>
                          <Text size="lg" fw={500} c="dimmed">
                            No schemes found
                          </Text>
                          <Text size="sm" c="dimmed">
                            Try adjusting your search or filter criteria
                          </Text>
                        </div>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Section>
    </Stack>
  );
}
