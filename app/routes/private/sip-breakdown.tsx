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
import { Await, useLoaderData, useNavigate, useNavigation } from "react-router";

import { ROUTES } from "#/constants/routes";
import { getSavingsCategorySummary } from "#/database/getSummaryBySavingsCategory.server";

const CHART_HEIGHT = { base: 300, xs: 360 };

export async function loader() {
  return {
    savingsCategorySummary: getSavingsCategorySummary(),
  };
}

export default function SipBreakdown() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const navigation = useNavigation();
  const { savingsCategorySummary } = useLoaderData<typeof loader>();
  const isNavigation = Boolean(navigation.location);

  function handleClose() {
    navigate(ROUTES.OVERVIEW, { preventScrollReset: true });
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
              <Await resolve={savingsCategorySummary}>
                {(categories) => {
                  const data: Partial<ComputedDatum<DefaultRawDatum>>[] =
                    categories.map((category) => ({
                      id: category.name,
                      label: category.name,
                      value: Number(category.monthly_sip),
                      color: getThemeColor(`${category.color}.5`, theme),
                    }));

                  return (
                    <ResponsivePie
                      animate
                      margin={{ left: 72, right: 72 }}
                      innerRadius={0.6}
                      data={data}
                      padAngle={1.2}
                      colors={{ datum: "data.color" }}
                      cornerRadius={6}
                      arcLinkLabelsTextColor={getThemeColor("black", theme)}
                      arcLinkLabelsThickness={2}
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
