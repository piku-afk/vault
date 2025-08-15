import {
  Badge,
  Box,
  Card,
  Group,
  Image,
  Modal,
  NumberFormatter,
  Progress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { ROUTES } from "#/constants/routes";
import { getCategoryDetails } from "#/database/get-category-details";

import type { Route } from "./+types/category-details";

export async function loader({ params }: Route.LoaderArgs) {
  const { category } = params;
  const { categoryDetails, schemes } = await getCategoryDetails(category);

  return { categoryDetails, schemes };
}

export default function CategoryDetails({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { category } = useParams();

  function handleClose() {
    navigate(ROUTES.OVERVIEW, { preventScrollReset: true });
  }

  return (
    <Modal.Root
      size="xl"
      opened
      centered
      onClose={handleClose}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Modal.Overlay blur={2} />
      <Modal.Content>
        <Modal.Header
          style={(theme) => ({
            borderBottom: `1px solid ${theme.colors.gray[3]}`,
          })}
        >
          <Group>
            <ThemeIcon mt={2} variant="default" size="lg">
              <Image
                loading="lazy"
                src={loaderData.categoryDetails.icon}
                alt={loaderData.categoryDetails.name}
                w="auto"
                h={20}
              />
            </ThemeIcon>
            <Modal.Title>{category} Fund Details</Modal.Title>
          </Group>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body p="md">
          <SimpleGrid cols={{ base: 1, xs: 2 }}>
            {loaderData.schemes.map((scheme) => {
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
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
