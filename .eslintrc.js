module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    type: "commonjs",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": ["error", {}, { usePrettierrc: true }],
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "import/no-unresolved": "off",
    "import/extensions": ["off"],
  },
  // settings: {
  //   "import/resolver": {
  //     project: "/tsconfig.json",
  //   },
  // },
};
