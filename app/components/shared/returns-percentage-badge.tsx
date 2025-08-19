import {
  Badge,
  type BadgeProps,
  NumberFormatter,
  Tooltip,
} from "@mantine/core";

import { getReturnsColor, getReturnsPrefix } from "#/utils/financialHelpers";

export function ReturnsPercentageBadge(props: {
  value?: number | string;
  badgeProps?: BadgeProps;
}) {
  const returnColor = getReturnsColor(Number(props.value));
  const returnPrefix = getReturnsPrefix(Number(props.value));

  return (
    <Tooltip label="Returns percentage">
      <Badge
        ml="auto"
        variant="light"
        color={returnColor}
        style={{ flexShrink: 0 }}
        {...props.badgeProps}
      >
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
