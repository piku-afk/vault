import {
  Badge,
  Box,
  Card,
  Center,
  Collapse,
  Divider,
  Grid,
  Group,
  Image,
  List,
  NumberFormatter,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import { Suspense } from "react";
import { Await, redirect, useSearchParams } from "react-router";

import { CurrencyFormatter } from "#/components/shared/currency-formatter";
import { GoalCard, GoalCardSkeleton } from "#/components/shared/goal-card";
import { Section2 } from "#/components/shared/section2";
import { returns_percentage } from "#/database/get-overview.server";
import { getXirrSummary } from "#/database/get-xirr.server";
import { db } from "#/database/kysely.server";
import { requireAuth } from "#/middlewares/requireAuth";

import type { Route } from "./+types/overview_v2";

const CATEGORY_PARAM = "category";
const CATEGORY_ALL = "current value";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  const category = new URL(request.url).searchParams.get(CATEGORY_PARAM);
  if (!category) {
    return redirect(`?category=${CATEGORY_ALL}`);
  }

  const summary = db
    .selectFrom("mutual_fund_schemes_summary")
    .select((eb) => [
      eb.fn.sum<number>("net_current").as("net_current"),
      eb.fn.sum<number>("net_invested").as("net_invested"),
      eb.fn.sum<number>("net_returns").as("net_returns"),
      returns_percentage.as("net_returns_percentage"),
    ])
    .$if(category !== CATEGORY_ALL, (eb) =>
      eb.where((eb) =>
        eb(eb.fn("lower", ["saving_category"]), "=", category.toLowerCase()),
      ),
    )
    .executeTakeFirstOrThrow();

  const stats = db
    .selectFrom("savings_categories_summary")
    .select("sip_amount")
    .$if(category !== CATEGORY_ALL, (eb) =>
      eb.where((eb) =>
        eb(eb.fn("lower", ["category"]), "=", category.toLowerCase()),
      ),
    )
    .executeTakeFirstOrThrow();

  const xirr = getXirrSummary(category === CATEGORY_ALL ? undefined : category);
  const categoryGoal = await db
    .selectFrom("goals_summary")
    .selectAll()
    .where((eb) => eb(eb.fn("lower", ["name"]), "=", category.toLowerCase()))
    .executeTakeFirst();

  const schemes = await db
    .selectFrom("mutual_fund_schemes_summary as summary")
    .innerJoin(
      "mutual_fund_schemes as mfs",
      "mfs.scheme_name",
      "summary.scheme_name",
    )
    .selectAll(["summary"])
    .select(["mfs.logo", "mfs.nav", "mfs.sip_amount"])
    .$if(category !== CATEGORY_ALL, (eb) =>
      eb.where((eb) =>
        eb(
          eb.fn("lower", ["summary.saving_category"]),
          "=",
          category.toLowerCase(),
        ),
      ),
    )
    .orderBy("summary.net_returns", "desc")
    .execute();

  return { summary, stats, xirr, categoryGoal, schemes };
}

function OverviewV2({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  console.log(loaderData.schemes);

  return (
    <Stack mt="md" gap="xl">
      <title>Vault - Overview v2</title>

      <SegmentedControl
        color="violet"
        value={searchParams.get(CATEGORY_PARAM) as string}
        onChange={(value) => {
          setSearchParams({ category: value });
        }}
        data={[
          { label: "All", value: "current value" },
          { label: "Emergency", value: "emergency" },
          { label: "Bike", value: "bike" },
          { label: "Home", value: "home" },
          { label: "Long Term", value: "long term" },
        ]}
      />

      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xl">
        <Section2 title="Summary">
          <Card.Section>
            <Table
              variant="vertical"
              layout="fixed"
              tabularNums
              withColumnBorders
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th>Current Value</Table.Th>
                  <Table.Td>
                    <Suspense fallback={<SkeletonText />}>
                      <Await resolve={loaderData.summary}>
                        {(summary) => (
                          <CurrencyFormatter value={summary?.net_current} />
                        )}
                      </Await>
                    </Suspense>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Invested Value</Table.Th>
                  <Table.Td>
                    <Suspense fallback={<SkeletonText />}>
                      <Await resolve={loaderData.summary}>
                        {(summary) => (
                          <CurrencyFormatter value={summary?.net_invested} />
                        )}
                      </Await>
                    </Suspense>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Returns</Table.Th>
                  <Table.Td>
                    <Suspense fallback={<SkeletonText />}>
                      <Await resolve={loaderData.summary}>
                        {(summary) => (
                          <Text
                            size="sm"
                            c={summary?.net_returns > 0 ? "teal" : "red"}
                          >
                            <CurrencyFormatter value={summary?.net_returns} />
                            &nbsp;(
                            <NumberFormatter
                              value={Math.abs(
                                Number(summary?.net_returns_percentage),
                              )}
                              decimalScale={2}
                              suffix="%"
                            />
                            )
                          </Text>
                        )}
                      </Await>
                    </Suspense>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>XIRR</Table.Th>
                  <Table.Td>
                    <Suspense fallback={<SkeletonText />}>
                      <Await resolve={loaderData.xirr}>
                        {(xirr) => (
                          <Text size="sm" c={xirr > 0 ? "teal" : "red"}>
                            <NumberFormatter
                              value={xirr}
                              decimalScale={2}
                              suffix="%"
                            />
                          </Text>
                        )}
                      </Await>
                    </Suspense>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>SIP</Table.Th>
                  <Table.Td>
                    <Suspense fallback={<SkeletonText />}>
                      <Await resolve={loaderData.stats}>
                        {(stats) => (
                          <Text size="sm">
                            <CurrencyFormatter value={stats?.sip_amount ?? 0} />
                          </Text>
                        )}
                      </Await>
                    </Suspense>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Section2>

        <Suspense
          fallback={Array.from(Array(3).keys()).map((item) => (
            <GoalCardSkeleton key={item} />
          ))}
        >
          <Await resolve={loaderData.categoryGoal}>
            {(categoryGoal) => (
              <Collapse in={!!categoryGoal}>
                <Section2 title="Category Goal">
                  {categoryGoal && <GoalCard goal={categoryGoal} />}
                </Section2>
              </Collapse>
            )}
          </Await>
        </Suspense>
      </SimpleGrid>

      <Suspense
        fallback={Array.from(Array(5).keys()).map((item, index, array) => (
          <List.Item key={item}>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, xs: 6 }}>
                <Group align="flex-start" wrap="nowrap">
                  <Skeleton height={28} width={28} radius="md" mt={2} />
                  <Box style={{ flex: 1 }}>
                    <Skeleton height={21} width="90%" mb={6} />
                    <Group gap="xs" mt={6} wrap="wrap">
                      <Skeleton height={16} width={80} radius="sm" />
                      <Skeleton height={12} width={100} />
                    </Group>
                  </Box>
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 6, xs: 3 }}>
                <Stack gap="xs" style={{ flexShrink: 0 }}>
                  <Skeleton height={12} width={100} />
                  <Skeleton height={12} width={100} />
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 6, xs: 3 }}>
                <Stack gap="xs" align="flex-end" style={{ flexShrink: 0 }}>
                  <Skeleton height={16} width={120} />
                  <Skeleton height={12} width={80} />
                </Stack>
              </Grid.Col>
            </Grid>
            {index < array.length - 1 && <Divider mt="md" />}
          </List.Item>
        ))}
      >
        <Await resolve={loaderData.schemes}>
          {(schemes) => (
            <Section2 title="Schemes" subText={`(${schemes.length})`}>
              <List mt="md" spacing="md">
                {schemes.length > 0 ? (
                  schemes.map((scheme, index, array) => (
                    <List.Item key={scheme.scheme_name}>
                      <Grid gutter="lg">
                        <Grid.Col span={{ base: 12, xs: 6 }}>
                          <Group gap="md" wrap="nowrap">
                            {scheme.logo && (
                              <Image
                                loading="lazy"
                                radius="md"
                                w="auto"
                                h={28}
                                mt={2}
                                src={scheme.logo}
                                alt={scheme.scheme_name as string}
                              />
                            )}
                            <Box style={{ flexGrow: 1 }}>
                              <Text fw={500} size="sm" lineClamp={1}>
                                {scheme.scheme_name}
                              </Text>
                              <Group gap="xs" mt={6}>
                                <Text
                                  size="xs"
                                  fw={500}
                                  c={
                                    (scheme.net_returns as number) > 0
                                      ? "green"
                                      : "red"
                                  }
                                >
                                  <CurrencyFormatter
                                    prefix={
                                      (scheme.net_returns as number) > 0
                                        ? "+"
                                        : "-"
                                    }
                                    value={scheme.net_returns as number}
                                  />
                                  &nbsp;({scheme.net_returns_percentage}%)
                                </Text>
                                <Badge variant="light" color="gray" size="xs">
                                  SIP:{" "}
                                  <CurrencyFormatter
                                    value={scheme.sip_amount}
                                  />
                                </Badge>
                              </Group>
                            </Box>
                          </Group>
                        </Grid.Col>
                        <Grid.Col span={{ base: 6, xs: 3 }}>
                          <Stack gap={6}>
                            <Text size="xs">
                              Units:{" "}
                              <NumberFormatter
                                value={scheme.net_units as number}
                              />
                            </Text>
                            <Text size="xs">
                              NAV:{" "}
                              <CurrencyFormatter value={scheme.nav as number} />
                            </Text>
                          </Stack>
                        </Grid.Col>
                        <Grid.Col span={{ base: 6, xs: 3 }}>
                          <Stack gap={4} ta="right" style={{ flexShrink: 0 }}>
                            <Text fw={500} size="sm">
                              <CurrencyFormatter
                                value={scheme.net_current as number}
                              />
                            </Text>
                            <Text size="xs" c="dimmed" tt="capitalize">
                              <CurrencyFormatter
                                value={scheme.net_invested as number}
                              />
                            </Text>
                          </Stack>
                        </Grid.Col>
                      </Grid>
                      {/* {index < array.length - 1 && (
                        <Card.Section>
                          <Divider />
                        </Card.Section>
                      )} */}
                    </List.Item>
                  ))
                ) : (
                  <List.Item>
                    <Center py="xl">
                      <Text c="dimmed">No schemes</Text>
                    </Center>
                  </List.Item>
                )}
              </List>
            </Section2>
          )}
        </Await>
      </Suspense>
    </Stack>
  );
}

export default OverviewV2;

function SkeletonText() {
  return (
    <Skeleton visible w="100%" h="calc(var(--mantine-line-height) * 1em)" />
  );
}
