import {
  Container,
  getThemeColor,
  LoadingOverlay,
  Modal,
  Skeleton,
  Text,
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

const CHART_HEIGHT = { base: 300, xs: 360 };

export async function loader({ params }: Route.LoaderArgs) {
  const { category } = params;
  console.log("category", category);

  console.log(await getSipBreakdown(category));

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
    <Modal.Root centered opened={true} onClose={handleClose}>
      <Modal.Overlay blur={7} />
      <Modal.Content>
        <Modal.Body>
          <Container h={CHART_HEIGHT} p={0}>
            <LoadingOverlay visible={isNavigation} overlayProps={{ blur: 7 }} />

            <Suspense
              fallback={
                <Skeleton
                  circle
                  style={{
                    width: 280,
                    height: 280,
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
                      margin={{ left: 104, right: 104 }}
                      innerRadius={0.6}
                      data={data}
                      padAngle={1.2}
                      colors={{ datum: "data.color" }}
                      cornerRadius={6}
                      arcLinkLabelsTextColor={getThemeColor("black", theme)}
                      arcLinkLabelsThickness={2}
                      arcLinkLabel="label"
                      arcLinkLabelsColor={{ from: "color" }}
                      arcLabelsTextColor={getThemeColor("black", theme)}
                      tooltip={() => null}
                    />
                  );
                }}
              </Await>
            </Suspense>
            <Text
              size="xs"
              c="dimmed"
              ta="center"
              pos="absolute"
              bottom={16}
              left="50%"
              style={{ transform: "translateX(-50%)" }}
            >
              SIP Breakdown
            </Text>
          </Container>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
