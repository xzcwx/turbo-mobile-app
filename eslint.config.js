module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  rules: {
    "vue/no-mutating-props": "off",
    "vue/custom-event-name-casing": "off",
    "vue/no-reserved-component-names": "off",
    "vue/multi-word-component-names": "off",
    "no-use-before-define": "off",
    "space-before-function-paren": "off",
    "quotes": ["error", "double"],
    "allowTemplateLiterals": 0,
    "comma-dangle": ["error", "never"],
    "prettier/prettier": "warn",
    "prefer-const": 0,
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
    ],
  }
};
