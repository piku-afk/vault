import {
  Badge,
  Card,
  Divider,
  Group,
  NumberFormatter,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  Activity,
  ArrowUpRight,
  Building2,
  Clock,
  DollarSign,
  PieChart,
  Target,
  TrendingUp,
} from "lucide-react";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { Section } from "#/components/section";
import { getGoalProgress } from "#/utils/getGoals.server";
import {
  getQuickStats,
  getRecentTransactions,
} from "#/utils/getOverviewStats.server";
import {
  getBestPerformer,
  getPortfolioDiversification,
} from "#/utils/getPortfolioAnalytics.server";
import { getSummaryBySavingsCategory } from "#/utils/getSummaryBySavingsCategory.server";
import { getSummaryData } from "#/utils/getSummaryData.server";

import type { Route } from "./+types/overview";

export async function loader() {
  const summary = await getSummaryData();
  const summaryBySavingsCategory = await getSummaryBySavingsCategory();
  const goalProgress = await getGoalProgress(summary.net_worth);
  const recentTransactions = await getRecentTransactions(8);
  const quickStats = await getQuickStats();
  const portfolioDiversification = await getPortfolioDiversification();
  const bestPerformer = await getBestPerformer();

  return {
    summary,
    summaryBySavingsCategory,
    goalProgress,
    recentTransactions,
    quickStats,
    portfolioDiversification,
    bestPerformer,
  };
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const {
    summary: { net_invested, net_returns, net_returns_percentage, net_worth },
    summaryBySavingsCategory,
    goalProgress,
    recentTransactions,
    quickStats,
    portfolioDiversification,
    bestPerformer,
  } = loaderData;

  const totalReturn = net_returns;
  const isPositiveReturn = totalReturn > 0;

  return (
    <Stack gap="xl" pb="xl">
      {/* Hero Summary Cards */}
      <Section title="Portfolio Overview">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {/* Net Worth Card */}
          <Card
            withBorder
            radius="lg"
            p="xl"
            bg="gradient-to-br from-violet-50 to-violet-100"
          >
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Text size="sm" fw={500} c="violet.7">
                  Net Worth
                </Text>
                <Badge variant="light" color="violet" size="sm">
                  Total
                </Badge>
              </Group>
              <Title order={2} c="violet.9" fw={700}>
                <CurrencyFormatter value={net_worth} />
              </Title>
              <Text size="xs" c="violet.6">
                Current portfolio value
              </Text>
            </Stack>
          </Card>

          {/* Net Invested Card */}
          <Card
            withBorder
            radius="lg"
            p="xl"
            bg="gradient-to-br from-blue-50 to-blue-100"
          >
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Text size="sm" fw={500} c="blue.7">
                  Net Invested
                </Text>
                <Badge variant="light" color="blue" size="sm">
                  Principal
                </Badge>
              </Group>
              <Title order={2} c="blue.9" fw={700}>
                <CurrencyFormatter value={net_invested} />
              </Title>
              <Text size="xs" c="blue.6">
                Total amount invested
              </Text>
            </Stack>
          </Card>

          {/* Returns Card */}
          <Card
            withBorder
            radius="lg"
            p="xl"
            bg={
              isPositiveReturn
                ? "gradient-to-br from-teal-50 to-teal-100"
                : "gradient-to-br from-red-50 to-red-100"
            }
          >
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Text
                  size="sm"
                  fw={500}
                  c={isPositiveReturn ? "teal.7" : "red.7"}
                >
                  Returns
                </Text>
                <Badge
                  variant="light"
                  color={isPositiveReturn ? "teal" : "red"}
                  size="sm"
                >
                  {isPositiveReturn ? "Profit" : "Loss"}
                </Badge>
              </Group>
              <Title
                order={2}
                c={isPositiveReturn ? "teal.9" : "red.9"}
                fw={700}
              >
                <CurrencyFormatter
                  value={Math.abs(totalReturn)}
                  prefix={isPositiveReturn ? "+₹" : "-₹"}
                />
              </Title>
              <Group gap="xs" align="center">
                <Text
                  size="sm"
                  fw={600}
                  c={isPositiveReturn ? "teal.7" : "red.7"}
                >
                  <NumberFormatter
                    value={Math.abs(net_returns_percentage)}
                    suffix="%"
                    decimalScale={2}
                    prefix={isPositiveReturn ? "+" : "-"}
                  />
                </Text>
                <Text size="xs" c="dimmed">
                  return rate
                </Text>
              </Group>
            </Stack>
          </Card>
        </SimpleGrid>
      </Section>

      {/* Quick Stats */}
      <Section title="Quick Stats">
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          {/* Total Schemes */}
          <Card withBorder radius="md" p="md" bg="gray.0">
            <Group gap="sm">
              <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                <Building2 size={20} />
              </ThemeIcon>
              <div>
                <Text size="xl" fw={700} c="blue.7">
                  {quickStats.totalSchemes}
                </Text>
                <Text size="xs" c="dimmed">
                  Total Schemes
                </Text>
              </div>
            </Group>
          </Card>

          {/* Monthly SIP */}
          <Card withBorder radius="md" p="md" bg="green.0">
            <Group gap="sm">
              <ThemeIcon variant="light" color="green" size="lg" radius="md">
                <DollarSign size={20} />
              </ThemeIcon>
              <div>
                <Text size="xl" fw={700} c="green.7">
                  <CurrencyFormatter value={quickStats.averageMonthlySip} />
                </Text>
                <Text size="xs" c="dimmed">
                  Avg Monthly SIP
                </Text>
              </div>
            </Group>
          </Card>

          {/* Best Performer */}
          {bestPerformer && (
            <Card withBorder radius="md" p="md" bg="teal.0">
              <Group gap="sm">
                <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                  <TrendingUp size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xl" fw={700} c="teal.7">
                    +{bestPerformer.returnsPercentage.toFixed(1)}%
                  </Text>
                  <Text size="xs" c="dimmed">
                    {bestPerformer.category}
                  </Text>
                </div>
              </Group>
            </Card>
          )}

          {/* Days Since Last Transaction */}
          <Card withBorder radius="md" p="md" bg="violet.0">
            <Group gap="sm">
              <ThemeIcon variant="light" color="violet" size="lg" radius="md">
                <Clock size={20} />
              </ThemeIcon>
              <div>
                <Text size="xl" fw={700} c="violet.7">
                  {quickStats.daysSinceLastTransaction || 0}
                </Text>
                <Text size="xs" c="dimmed">
                  Days Since Last
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>
      </Section>

      {/* Investment Goals */}
      {goalProgress.length > 0 && (
        <>
          <Section title="Investment Goals">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {goalProgress.map((goal) => (
                <Card key={goal.id} withBorder radius="lg" p="lg">
                  <Stack gap="md">
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon
                            variant="light"
                            color="violet"
                            size="sm"
                            radius="md"
                          >
                            <Target size={14} />
                          </ThemeIcon>
                          <Text fw={600} size="lg">
                            {goal.name}
                          </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Target: <CurrencyFormatter value={goal.target} />
                        </Text>
                      </div>
                      <Badge
                        variant="light"
                        color={
                          goal.achieved
                            ? "teal"
                            : goal.progress > 75
                              ? "yellow"
                              : "blue"
                        }
                        size="lg"
                      >
                        {goal.progress.toFixed(1)}%
                      </Badge>
                    </Group>

                    <Progress
                      value={goal.progress}
                      color={
                        goal.achieved
                          ? "teal"
                          : goal.progress > 75
                            ? "yellow"
                            : "blue"
                      }
                      size="lg"
                      radius="xl"
                    />

                    <Group justify="space-between">
                      <div>
                        <Text size="xs" c="dimmed" mb={2}>
                          Current Progress
                        </Text>
                        <Text fw={600} size="sm">
                          <CurrencyFormatter value={net_worth} />
                        </Text>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Text size="xs" c="dimmed" mb={2}>
                          {goal.achieved ? "Achieved!" : "Remaining"}
                        </Text>
                        <Text
                          fw={600}
                          size="sm"
                          c={goal.achieved ? "teal.7" : "dimmed"}
                        >
                          {goal.achieved ? (
                            "🎉 Goal Reached!"
                          ) : (
                            <CurrencyFormatter value={goal.remaining} />
                          )}
                        </Text>
                      </div>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Section>

          <Divider />
        </>
      )}

      {/* Recent Activity */}
      <Section title="Recent Activity">
        <Card withBorder radius="lg" p="lg">
          <Stack gap="md">
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 6).map((transaction, index) => {
                const isPurchase = transaction.transaction_type === "Purchase";
                const transactionDate = new Date(transaction.date);
                const isToday =
                  transactionDate.toDateString() === new Date().toDateString();
                const isThisWeek =
                  (Date.now() - transactionDate.getTime()) /
                    (1000 * 60 * 60 * 24) <=
                  7;

                return (
                  <div key={transaction.id}>
                    <Group justify="space-between" align="flex-start">
                      <Group gap="md" align="flex-start">
                        <ThemeIcon
                          variant="light"
                          color={isPurchase ? "blue" : "orange"}
                          size="lg"
                          radius="md"
                        >
                          <ArrowUpRight
                            size={18}
                            style={{
                              transform: isPurchase
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                            }}
                          />
                        </ThemeIcon>
                        <div>
                          <Text fw={600} size="sm" lineClamp={1}>
                            {transaction.scheme_name}
                          </Text>
                          <Group gap="xs" mt={2}>
                            <Badge variant="light" color="gray" size="xs">
                              {transaction.saving_category}
                            </Badge>
                            <Text size="xs" c="dimmed">
                              {isToday
                                ? "Today"
                                : isThisWeek
                                  ? transactionDate.toLocaleDateString(
                                      "en-US",
                                      { weekday: "short" },
                                    )
                                  : transactionDate.toLocaleDateString(
                                      "en-US",
                                      { month: "short", day: "numeric" },
                                    )}
                            </Text>
                          </Group>
                        </div>
                      </Group>
                      <div style={{ textAlign: "right" }}>
                        <Text
                          fw={600}
                          size="sm"
                          c={isPurchase ? "blue.7" : "orange.7"}
                        >
                          {isPurchase ? "+" : "-"}
                          <CurrencyFormatter value={transaction.amount} />
                        </Text>
                        <Text size="xs" c="dimmed">
                          {transaction.units} units
                        </Text>
                      </div>
                    </Group>
                    {index < recentTransactions.slice(0, 6).length - 1 && (
                      <Divider my="sm" />
                    )}
                  </div>
                );
              })
            ) : (
              <Group
                gap="md"
                c="dimmed"
                style={{ justifyContent: "center", padding: "2rem 0" }}
              >
                <Activity size={24} />
                <Text>No recent transactions</Text>
              </Group>
            )}
          </Stack>
        </Card>
      </Section>

      {/* Portfolio Diversification */}
      <Section title="Portfolio Diversification">
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
          {/* Diversification Chart */}
          <Card withBorder radius="lg" p="lg">
            <Group justify="center" mb="md">
              <ThemeIcon variant="light" color="indigo" size="lg" radius="md">
                <PieChart size={20} />
              </ThemeIcon>
              <Text fw={600} size="lg">
                Asset Allocation
              </Text>
            </Group>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <RingProgress
                size={200}
                thickness={20}
                sections={portfolioDiversification.map((item, index) => ({
                  value: item.percentage,
                  color: ["blue", "teal", "violet", "orange", "green", "red"][
                    index % 6
                  ],
                  tooltip: `${item.category}: ${item.percentage.toFixed(1)}%`,
                }))}
                label={
                  <Text size="xs" ta="center" fw={600} c="dimmed">
                    {portfolioDiversification.length} Categories
                  </Text>
                }
              />
            </div>

            <Stack gap="sm">
              {portfolioDiversification.map((item, index) => (
                <Group key={item.category} justify="space-between">
                  <Group gap="xs">
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: [
                          "#339af0",
                          "#20c997",
                          "#7950f2",
                          "#fd7e14",
                          "#51cf66",
                          "#ff6b6b",
                        ][index % 6],
                      }}
                    />
                    <Text size="sm" fw={500}>
                      {item.category}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={600} c="dimmed">
                      {item.percentage.toFixed(1)}%
                    </Text>
                    <Text size="xs" c="dimmed">
                      <CurrencyFormatter value={item.invested} />
                    </Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Card>

          {/* Allocation Insights */}
          <Card withBorder radius="lg" p="lg">
            <Text fw={600} size="lg" mb="lg">
              Allocation Insights
            </Text>

            <Stack gap="lg">
              {/* Largest Allocation */}
              {portfolioDiversification.length > 0 && (
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Largest Allocation
                  </Text>
                  <Group justify="space-between">
                    <Text fw={600}>
                      {portfolioDiversification[0]?.category}
                    </Text>
                    <Badge variant="light" color="blue" size="lg">
                      {portfolioDiversification[0]?.percentage.toFixed(1)}%
                    </Badge>
                  </Group>
                </div>
              )}

              {/* Diversification Score */}
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Diversification Score
                </Text>
                <Group align="center" gap="md">
                  <Progress
                    value={Math.min(portfolioDiversification.length * 20, 100)}
                    color={
                      portfolioDiversification.length >= 4
                        ? "teal"
                        : portfolioDiversification.length >= 2
                          ? "yellow"
                          : "red"
                    }
                    size="lg"
                    radius="xl"
                    style={{ flex: 1 }}
                  />
                  <Text fw={600} size="sm">
                    {portfolioDiversification.length >= 4
                      ? "Good"
                      : portfolioDiversification.length >= 2
                        ? "Fair"
                        : "Low"}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed" mt="xs">
                  Based on {portfolioDiversification.length} categories
                </Text>
              </div>

              {/* Recommendation */}
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Recommendation
                </Text>
                <Text size="sm">
                  {portfolioDiversification.length < 3
                    ? "Consider diversifying across more asset categories for better risk management."
                    : portfolioDiversification[0]?.percentage > 60
                      ? "Your portfolio is heavily concentrated. Consider rebalancing."
                      : "Your portfolio shows good diversification across categories."}
                </Text>
              </div>
            </Stack>
          </Card>
        </SimpleGrid>
      </Section>

      <Divider />

      {/* Portfolio Diversification */}
      <Section title="Portfolio Diversification">
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
          {/* Diversification Chart */}
          <Card withBorder radius="lg" p="lg">
            <Group justify="center" mb="md">
              <ThemeIcon variant="light" color="indigo" size="lg" radius="md">
                <PieChart size={20} />
              </ThemeIcon>
              <Text fw={600} size="lg">
                Asset Allocation
              </Text>
            </Group>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <RingProgress
                size={200}
                thickness={20}
                sections={portfolioDiversification.map((item, index) => ({
                  value: item.percentage,
                  color: ["blue", "teal", "violet", "orange", "green", "red"][
                    index % 6
                  ],
                  tooltip: `${item.category}: ${item.percentage.toFixed(1)}%`,
                }))}
                label={
                  <Text size="xs" ta="center" fw={600} c="dimmed">
                    {portfolioDiversification.length} Categories
                  </Text>
                }
              />
            </div>

            <Stack gap="sm">
              {portfolioDiversification.map((item, index) => (
                <Group key={item.category} justify="space-between">
                  <Group gap="xs">
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: [
                          "#339af0",
                          "#20c997",
                          "#7950f2",
                          "#fd7e14",
                          "#51cf66",
                          "#ff6b6b",
                        ][index % 6],
                      }}
                    />
                    <Text size="sm" fw={500}>
                      {item.category}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={600} c="dimmed">
                      {item.percentage.toFixed(1)}%
                    </Text>
                    <Text size="xs" c="dimmed">
                      <CurrencyFormatter value={item.invested} />
                    </Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Card>

          {/* Allocation Insights */}
          <Card withBorder radius="lg" p="lg">
            <Text fw={600} size="lg" mb="lg">
              Allocation Insights
            </Text>

            <Stack gap="lg">
              {/* Largest Allocation */}
              {portfolioDiversification.length > 0 && (
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Largest Allocation
                  </Text>
                  <Group justify="space-between">
                    <Text fw={600}>
                      {portfolioDiversification[0]?.category}
                    </Text>
                    <Badge variant="light" color="blue" size="lg">
                      {portfolioDiversification[0]?.percentage.toFixed(1)}%
                    </Badge>
                  </Group>
                </div>
              )}

              {/* Diversification Score */}
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Diversification Score
                </Text>
                <Group align="center" gap="md">
                  <Progress
                    value={Math.min(portfolioDiversification.length * 20, 100)}
                    color={
                      portfolioDiversification.length >= 4
                        ? "teal"
                        : portfolioDiversification.length >= 2
                          ? "yellow"
                          : "red"
                    }
                    size="lg"
                    radius="xl"
                    style={{ flex: 1 }}
                  />
                  <Text fw={600} size="sm">
                    {portfolioDiversification.length >= 4
                      ? "Good"
                      : portfolioDiversification.length >= 2
                        ? "Fair"
                        : "Low"}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed" mt="xs">
                  Based on {portfolioDiversification.length} categories
                </Text>
              </div>

              {/* Recommendation */}
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Recommendation
                </Text>
                <Text size="sm">
                  {portfolioDiversification.length < 3
                    ? "Consider diversifying across more asset categories for better risk management."
                    : portfolioDiversification[0]?.percentage > 60
                      ? "Your portfolio is heavily concentrated. Consider rebalancing."
                      : "Your portfolio shows good diversification across categories."}
                </Text>
              </div>
            </Stack>
          </Card>
        </SimpleGrid>
      </Section>

      <Divider />

      {/* Category Breakdown */}
      <Section title="Category Performance">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {summaryBySavingsCategory.map((category) => {
            const categoryReturn = category.returns;
            const categoryIsPositive = categoryReturn > 0;
            const progressValue =
              category.invested > 0
                ? Math.min((category.current / category.invested) * 100, 150)
                : 0;

            return (
              <Card key={category.name} withBorder radius="lg" p="lg">
                <Stack gap="md">
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Text fw={600} size="lg">
                        {category.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Investment category
                      </Text>
                    </div>
                    <Badge
                      variant="light"
                      color={categoryIsPositive ? "teal" : "red"}
                      size="lg"
                    >
                      <NumberFormatter
                        value={Math.abs(category.returns_percentage)}
                        suffix="%"
                        decimalScale={1}
                        prefix={categoryIsPositive ? "+" : "-"}
                      />
                    </Badge>
                  </Group>

                  <Progress
                    value={progressValue}
                    color={categoryIsPositive ? "teal" : "red"}
                    size="sm"
                    radius="xl"
                  />

                  <SimpleGrid cols={3} spacing="xs">
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Invested
                      </Text>
                      <Text fw={600} size="sm">
                        <CurrencyFormatter value={category.invested} />
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Current
                      </Text>
                      <Text fw={600} size="sm">
                        <CurrencyFormatter value={category.current} />
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
                          value={Math.abs(categoryReturn)}
                          prefix={categoryIsPositive ? "+₹" : "-₹"}
                        />
                      </Text>
                    </div>
                  </SimpleGrid>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Section>
    </Stack>
  );
}
