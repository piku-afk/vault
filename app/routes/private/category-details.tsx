import {
  Container,
  Group,
  Image,
  Modal,
  ScrollArea,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import { useLoaderData, useNavigate, useParams } from "react-router";

import FundPerformance from "#/components/category-details/fund-performance";
import { ROUTES } from "#/constants/routes";
import { getCategoryDetails } from "#/database/get-category-details";

import type { Route } from "./+types/category-details";

export async function loader({ params }: Route.LoaderArgs) {
  const { category } = params;
  const { categoryDetails, schemes } = await getCategoryDetails(category);

  return { categoryDetails, schemes };
}

export const useCategoryDetailsLoaderData = () => {
  return useLoaderData<typeof loader>();
};

export default function CategoryDetails({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { category } = useParams();

  function handleClose() {
    navigate(ROUTES.OVERVIEW, { preventScrollReset: true });
  }

  return (
    <Modal.Root
      size="auto"
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
            <Modal.Title fz="h4" fw={500}>
              {category} Fund Details
            </Modal.Title>
          </Group>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body p={0}>
          <Container w="100%" size="md" pb="xl" pt="md">
            <Stack gap="xl">
              <FundPerformance />
            </Stack>
          </Container>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
