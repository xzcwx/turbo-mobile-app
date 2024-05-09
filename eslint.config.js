const globals = require("globals");
const eslint = require("@eslint/js");
const vue_eslint = require("eslint-plugin-vue");
const ts_eslint = require("typescript-eslint");
const prettier_eslint = require("eslint-config-prettier");

module.exports = [
  // flat/recommended: VUE3错误、意外行为、主观社区默认值规则
  // flat/strongly-recommended: 大大提高代码可读性和/或开发体验的规则
  // flat/essential: 防止错误或意外行为的基本规则
  eslint.configs.recommended,
  prettier_eslint,
  ...ts_eslint.configs.recommended,
  ...vue_eslint.configs["flat/recommended"],
  {
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
        UnknownObject: "readonly"
      },
      parserOptions: {
        parser: "@typescript-eslint/parser"
      }
    },
    rules: {
      "vue/no-mutating-props": "off",
      "vue/custom-event-name-casing": "off",
      "vue/no-reserved-component-names": "off",
      "vue/multi-word-component-names": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/max-attributes-per-line": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/singleline-html-element-content-newline": "off",
      "no-use-before-define": "off",
      "no-useless-escape": "off",
      "space-before-function-paren": "off",
      "quotes": "off",
      "allowTemplateLiterals": "off",
      "comma-dangle": "warn",
      "prefer-const": "warn",
      "@typescript-eslint/no-namespace": "warn",
      "@typescript-eslint/ban-ts-ignore": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-import-type-side-effects": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  }
];
