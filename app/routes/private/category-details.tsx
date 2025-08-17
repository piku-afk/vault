import { Divider, Modal, ScrollArea, Stack } from "@mantine/core";
import { useLoaderData, useNavigate, useParams } from "react-router";

import { PerformanceSection } from "#/components/sections/performance-section";
import { StatsSection } from "#/components/sections/stats-section";
import { SummarySection } from "#/components/sections/summary-section";
import { ROUTES } from "#/constants/routes";
import { getCategoryDetails } from "#/database/get-category-details";

import type { Route } from "./+types/category-details";

export async function loader({ params }: Route.LoaderArgs) {
  const { category } = params;
  return getCategoryDetails(category);
}

export const useCategoryDetailsLoaderData = () => {
  return useLoaderData<typeof loader>();
};

export default function CategoryDetails() {
  const navigate = useNavigate();
  const { category } = useParams();
  const loaderData = useCategoryDetailsLoaderData();
  const fundName = `${category} Fund`;

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
      <Modal.Overlay blur={7} />
      <Modal.Content>
        <Modal.Body pb="xl" pt="md">
          <Stack gap="xl">
            <SummarySection
              title={`${fundName} Summary`}
              data={loaderData.categorySummary}
            />
            <Divider />

            <StatsSection
              title={`${fundName} Stats`}
              data={loaderData.categoryStats}
            />
            <Divider />

            <PerformanceSection
              title={`${fundName} Performance`}
              data={loaderData.schemes}
            />
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
