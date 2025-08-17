import {
  Divider,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
} from "@mantine/core";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router";

import { AnalysisSection } from "#/components/sections/analysis-section";
import { PerformanceSection } from "#/components/sections/performance-section";
import { StatsSection } from "#/components/sections/stats-section";
import { SummarySection } from "#/components/sections/summary-section";
import { TransactionHistorySection } from "#/components/sections/transaction-history-section";
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
  const navigation = useNavigation();
  const isNavigation = Boolean(navigation.location);
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
          <LoadingOverlay visible={isNavigation} overlayProps={{ blur: 7 }} />
          <Stack gap="xl">
            <Outlet />

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

            <AnalysisSection
              title={`${fundName} Analysis`}
              data={loaderData.categoryAnalysis}
            />
            <Divider />

            <PerformanceSection
              title={`${fundName} Performance`}
              data={loaderData.schemes}
            />
            <Divider />

            <TransactionHistorySection
              title={`${fundName} Transaction History`}
              data={loaderData.recentTransactions}
            />
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
