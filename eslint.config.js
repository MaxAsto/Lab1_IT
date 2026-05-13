import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.vue"], 
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
        URL: "readonly",
        console: "readonly" // додано, щоб ESLint не сварився
      },
    },

    plugins: { prettier },

    rules: {
      "prettier/prettier": "error",
      "no-console": "warn", // залишаємо як попередження, щоб не блокувало білд
      "no-unused-vars": "error",
      "no-empty": "error",
    },
  },
];
