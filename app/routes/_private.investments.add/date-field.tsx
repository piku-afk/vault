import { DateInput, type DateInputProps } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function DateField(props: DateInputProps) {
  return (
    <DateInput valueFormat="DD/MM/YYYY" placeholder="DD/MM/YYYY" {...props} />
  );
}
