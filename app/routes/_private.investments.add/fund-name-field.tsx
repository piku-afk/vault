import { Select, type SelectProps } from "@mantine/core";
import { useLoaderData } from "react-router";
import type { loader } from "./route";

export function FundNameField(props: SelectProps) {
  const { fundNames } = useLoaderData<typeof loader>();

  return <Select {...props} searchable data={fundNames.data} />;
}
