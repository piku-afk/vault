import { Select, type SelectProps } from "@mantine/core";
import { useLoaderData } from "react-router";

import type { loader } from "./route";

export function TransactionTypeField(props: SelectProps) {
  const { transactionTypes } = useLoaderData<typeof loader>();

  return (
    <Select
      {...props}
      searchable
      placeholder="Search by transaction type"
      data={transactionTypes.data.sort()}
    />
  );
}
