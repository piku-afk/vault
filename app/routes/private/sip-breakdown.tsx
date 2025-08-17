import {
  Box,
  Container,
  Group,
  getThemeColor,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Skeleton,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  type ComputedDatum,
  type DefaultRawDatum,
  ResponsivePie,
} from "@nivo/pie";
import { Suspense } from "react";
import { Await, useNavigate, useNavigation } from "react-router";

import { ROUTES } from "#/constants/routes";
import { getSipBreakdown } from "#/database/get-sip-breakdown.server";

import type { Route } from "./+types/sip-breakdown";

const CHART_HEIGHT = { base: 280, xs: 360 };

export async function loader({ params }: Route.LoaderArgs) {
  const { category } = params;

  return {
    sipBreakdown: getSipBreakdown(category),
  };
}

export default function SipBreakdown({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const navigation = useNavigation();
  const isNavigation = Boolean(navigation.location);

  function handleClose() {
    // Navigate back by removing '/sip-breakdown' from current path
    navigate(
      window.location.pathname.replace(/\/sip-breakdown$/, "") ||
        ROUTES.OVERVIEW,
      { preventScrollReset: true },
    );
  }

  return (
    <Modal.Root size="lg" centered opened={true} onClose={handleClose}>
      <Modal.Overlay blur={7} />
      <Modal.Content>
        <Modal.Body>
          <Container>
            <LoadingOverlay visible={isNavigation} overlayProps={{ blur: 7 }} />
            <Text mb="md" size="sm" c="dimmed" ta="center">
              SIP Breakdown
            </Text>
            <Box h={CHART_HEIGHT}>
              <Suspense
                fallback={
                  <Skeleton
                    circle
                    w={{ base: 260, xs: 360 }}
                    h={{ base: 260, xs: 360 }}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                }
              >
                <Await resolve={loaderData.sipBreakdown}>
                  {(sipCategories) => {
                    const data: Partial<ComputedDatum<DefaultRawDatum>>[] =
                      sipCategories.map((category) => ({
                        id: category.id,
                        label: category.name,
                        value: Number(category.monthly_sip),
                        color: getThemeColor(`${category.color}.5`, theme),
                      }));
                    return (
                      <ResponsivePie
                        animate
                        innerRadius={0.6}
                        data={data}
                        padAngle={1.2}
                        colors={{ datum: "data.color" }}
                        cornerRadius={6}
                        enableArcLinkLabels={false}
                        arcLabelsTextColor={getThemeColor("black", theme)}
                        tooltip={() => null}
                      />
                    );
                  }}
                </Await>
              </Suspense>
            </Box>

            <SimpleGrid mt="xl" cols={{ base: 2, xs: 3 }}>
              <Await resolve={loaderData.sipBreakdown}>
                {(sipCategories) => (
                  <>
                    {sipCategories.map((category) => (
                      <Group key={category.id} gap="xs">
                        <ThemeIcon size="xs" color={category.color} />
                        <Text size="xs">{category.name}</Text>
                      </Group>
                    ))}
                  </>
                )}
              </Await>
            </SimpleGrid>
          </Container>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
