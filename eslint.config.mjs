import globals from \"globals\";
import js from \"@eslint/js\";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        describe: \"readonly\",
        test: \"readonly\",
        expect: \"readonly\",
        beforeEach: \"readonly\",
        afterEach: \"readonly\",
        jest: \"readonly\"
      }
    },
    rules: {
      \"no-unused-vars\": \"error\",
      \"no-console\": \"warn\",
      \"eqeqeq\": \"error\",
      \"no-var\": \"error\",
      \"prefer-const\": \"warn\"
    }
  }
];
