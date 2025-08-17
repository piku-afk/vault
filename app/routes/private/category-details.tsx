import { Container, Modal, ScrollArea, Stack } from "@mantine/core";
import { useLoaderData, useNavigate, useParams } from "react-router";

import { PerformanceSection } from "#/components/sections/performance-section";
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
  const { category } = useParams();
  const fundName = `${category} Fund`;
  const navigate = useNavigate();
  const loaderData = useCategoryDetailsLoaderData();

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
        <Modal.Body p={0}>
          <Container w="100%" size="md" pb="xl" pt="md">
            <Stack gap="xl">
              <PerformanceSection
                title={`${fundName} Performance`}
                data={loaderData.schemes}
              />
            </Stack>
          </Container>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
