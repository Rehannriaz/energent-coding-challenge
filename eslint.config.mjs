import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "next/typescript"
  ),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "build/**",
      "CODE_FILES/**"
    ]
  },
  {
    rules: {
      // TypeScript strict rules
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "error",
      
      // General code quality
      "prefer-const": "error",
      "no-var": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "prefer-template": "error",
      "no-duplicate-imports": "error",
      
      // React specific
      "react/jsx-key": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/self-closing-comp": "error",
      "react/jsx-boolean-value": ["error", "never"],
      
      // Performance and best practices
      "no-nested-ternary": "warn",
      "complexity": ["warn", { "max": 25 }],
      "max-depth": ["error", { "max": 4 }],
      "max-lines-per-function": ["warn", { 
        "max": 300,
        "skipBlankLines": true,
        "skipComments": true
      }]
    }
  }
];

export default eslintConfig;
