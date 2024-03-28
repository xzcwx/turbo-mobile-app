module.exports = {
  "**/src/*.{js,jsx,ts,tsx,vue}": [
    "eslint --fix",
    "prettier --write"
  ],
  "{package,tsconfig}.json": [
    "prettier --write --parser json"
  ]
};
