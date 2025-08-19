import {
  Badge,
  type BadgeProps,
  NumberFormatter,
  Tooltip,
} from "@mantine/core";

import { getReturnsColor, getReturnsPrefix } from "#/utils/financialHelpers";

export function XirrPercentageBadge(props: {
  value?: number | string;
  badgeProps?: BadgeProps;
}) {
  const returnColor = getReturnsColor(Number(props.value));
  const returnPrefix = getReturnsPrefix(Number(props.value));

  return (
    <Tooltip label="Annualized return rate">
      <Badge
        size="xs"
        variant="outline"
        color={returnColor}
        style={{ flexShrink: 0 }}
        {...props.badgeProps}
      >
        XIRR:{" "}
        <NumberFormatter
          value={props.value}
          suffix="%"
          decimalScale={2}
          allowNegative={false}
          prefix={returnPrefix}
        />
      </Badge>
    </Tooltip>
  );
}
