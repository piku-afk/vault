import netlifyPlugin from '@netlify/vite-plugin-react-router';
import { reactRouter } from '@react-router/dev/vite';
import mantinePostcss from 'postcss-preset-mantine';
import postcssSimpleVars from 'postcss-simple-vars';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        mantinePostcss,
        postcssSimpleVars({
          variables: {
            'mantine-breakpoint-xs': '36em',
            'mantine-breakpoint-sm': '48em',
            'mantine-breakpoint-md': '62em',
            'mantine-breakpoint-lg': '75em',
            'mantine-breakpoint-xl': '88em',
          },
        }),
      ],
    },
  },
  plugins: [reactRouter(), tsconfigPaths(), netlifyPlugin()],
  server: {
    port: 3000,
    host: true,
  },
});
