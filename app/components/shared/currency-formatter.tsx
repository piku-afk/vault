import { NumberFormatter, type NumberFormatterProps } from "@mantine/core";

export function CurrencyFormatter(props: NumberFormatterProps) {
  return (
    <NumberFormatter
      suffix=" INR"
      thousandSeparator
      thousandsGroupStyle="lakh"
      decimalScale={2}
      {...props}
    />
  );
}
