import { Maximize2 } from "lucide-react";
import { useNavigate } from "react-router";

import {
  FinancialCard,
  FinancialCardSkeleton,
} from "#/components/shared/financial-card";
import { ROUTES } from "#/constants/routes";
import type { getSavingsCategorySummary } from "#/database/getSummaryBySavingsCategory.server";
import { formatSchemeCount } from "#/utils/financialHelpers";

// Types
type CategoryData = Awaited<
  ReturnType<typeof getSavingsCategorySummary>
>[number];

interface CategoryCardProps {
  category: CategoryData;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();

  function handleViewDetails() {
    navigate(ROUTES.CATEGORY_DETAILS.replace(":category", category.name), {
      preventScrollReset: true,
    });
  }

  return (
    <FinancialCard
      data={{
        current: category.current,
        invested: category.invested,
        returns: category.returns,
        returns_percentage: category.returns_percentage,
      }}
      icon={category.icon || ""}
      iconAlt={category.name}
      title={category.name}
      subtitle={formatSchemeCount(Number(category.schemes_count))}
      onAction={handleViewDetails}
      actionIcon={<Maximize2 size={14} />}
      actionTooltip="View details"
      additionalStats={[
        {
          label: "Monthly SIP",
          value: Number(category.monthly_sip),
        },
      ]}
    />
  );
}

export function CategoryCardSkeleton() {
  return <FinancialCardSkeleton />;
}
