import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
  features: {
    stylistic: false,
    tooling: true,
    typescript: true,
    formatters: false
  }
});
