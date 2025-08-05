import { Button, createTheme, PasswordInput, TextInput } from '@mantine/core';

const fontFamily = 'Inter Variable, sans-serif';

export const theme = createTheme({
  fontFamily,
  headings: { fontFamily },
  primaryColor: 'violet',
  defaultRadius: 'md',
  components: {
    Button: Button.extend({
      defaultProps: {
        size: 'md',
        variant: 'filled',
        fw: 'normal',
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        size: 'md',
        variant: 'default',
        labelProps: { fw: 'normal', mb: 4 },
        errorProps: { mt: 'xs' },
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        size: 'md',
        variant: 'default',
        labelProps: { fw: 'normal', mb: 4 },
        errorProps: { mt: 'xs' },
      },
    }),
  },
});
