import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslint_config = [
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),
];

export default eslint_config;
