import { NumberFormatter, type NumberFormatterProps } from "@mantine/core";

export function CurrencyFormatter(props: NumberFormatterProps) {
  return (
    <NumberFormatter
      prefix="₹ "
      thousandSeparator
      thousandsGroupStyle="lakh"
      decimalScale={2}
      {...props}
    />
  );
}
