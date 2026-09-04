import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["lib/generated/**", ".next/**"],
  },
];

export default eslintConfig;
