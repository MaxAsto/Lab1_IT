import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    files: ["*.js", "*.vue"], // перевіряємо тільки файли у корені
    ignores: ["dist/**", "htmlcov/**"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        localStorage: "readonly",
        alert: "readonly",
        fetch: "readonly",
        MutationObserver: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        location: "readonly",
        Event: "readonly",
      },
    },

    plugins: { prettier },

    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "no-unused-vars": "error",
      "no-empty": "error",
    },
  },
];
