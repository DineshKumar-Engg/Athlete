const globals = require("globals");

module.exports = [
  {
    ignores: [
      "build/**",
      "node_modules/**",
      // add any other paths you want to ignore
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        window: "readonly",
        console: "readonly",
        document: "readonly",
        module: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "no-sync": "warn",
      "indent": ["error", 2], // Assuming 2 spaces for indentation
      "camelcase": ["error", { properties: "always" }],
    },
  },
];
