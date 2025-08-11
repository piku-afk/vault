import {
  Button,
  createTheme,
  List,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

const fontFamily = "Inter Variable, sans-serif";

export const theme = createTheme({
  fontFamily,
  headings: { fontFamily },
  primaryColor: "violet",
  defaultRadius: "md",
  components: {
    List: List.extend({
      defaultProps: {
        listStyleType: "none",
      },
    }),
    ListItem: List.Item.extend({
      defaultProps: {
        styles: {
          itemLabel: { width: "100%" },
          itemWrapper: { width: "100%" },
        },
      },
    }),
    Button: Button.extend({
      defaultProps: {
        size: "md",
        variant: "filled",
        fw: "normal",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        size: "md",
        variant: "default",
        labelProps: { fw: "normal", mb: 4 },
        errorProps: { mt: "xs" },
      },
    }),
    Select: Select.extend({
      defaultProps: {
        size: "md",
        variant: "default",
        checkIconPosition: "right",
        nothingFoundMessage: "Nothing found",
        labelProps: { fw: "normal", mb: 4 },
        comboboxProps: { shadow: "md" },
        errorProps: { mt: "xs" },
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        size: "md",
        variant: "default",
        labelProps: { fw: "normal", mb: 4 },
        errorProps: { mt: "xs" },
      },
    }),
    DateInput: DateInput.extend({
      defaultProps: {
        size: "md",
        variant: "default",
        labelProps: { fw: "normal", mb: 4 },
        errorProps: { mt: "xs" },
      },
    }),
  },
});
