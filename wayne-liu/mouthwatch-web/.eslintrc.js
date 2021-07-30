module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es2017": true
    },
    "extends": [
        "eslint:recommended",
        "prettier",
        "prettier/@typescript-eslint"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "none",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "comma",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          {
            "selector": "variable",
            "format": ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
            "leadingUnderscore": "allow"
          }
        ],
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-unused-expressions": [
            "error",
            {
                "allowTaggedTemplates": true,
                "allowShortCircuit": true
            }
        ],
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "never"
        ],
        "@typescript-eslint/triple-slash-reference": [
            "error",
            {
                "path": "always",
                "types": "prefer-import",
                "lib": "always"
            }
        ],
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "handle-callback-err": true,
                    "strict-type-predicates": true,
                    "whitespace": true
              }
            }
        ],
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/unified-signatures": "error",
        "arrow-spacing": "error",
        "block-spacing": "error",
        "brace-style": [
            "error",
            "1tbs"
        ],
        "comma-dangle": "error",
        "curly": [
            "error",
            "multi-line"
        ],
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "func-call-spacing": [
          "error",
          "never"
        ],
        "getter-return": "off",
        "id-blacklist": "error",
        "id-match": "error",
        "import/no-deprecated": "off",
        "jsdoc/check-alignment": "off",
        "jsdoc/check-indentation": "off",
        "jsdoc/newline-after-description": "off",
        "new-parens": "error",
        "no-caller": "error",
        "no-case-declarations": "off",
        "no-cond-assign": "error",
        "no-console": [
            "error",
            {
                "allow": [
                    "warn",
                    "dir",
                    "time",
                    "timeEnd",
                    "timeLog",
                    "trace",
                    "assert",
                    "clear",
                    "count",
                    "countReset",
                    "group",
                    "groupEnd",
                    "table",
                    "debug",
                    "info",
                    "dirxml",
                    "error",
                    "groupCollapsed",
                    "Console",
                    "profile",
                    "profileEnd",
                    "timeStamp",
                    "context"
                ]
            }
        ],
        "no-constant-condition": "error",
        "no-control-regex": "error",
        "no-duplicate-imports": "error",
        "no-empty": "error",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-invalid-regexp": "error",
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": "error",
        "no-redeclare": "error",
        "no-regex-spaces": "error",
        "no-return-await": "error",
        "no-self-assign": "off",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-underscore-dangle": "off",
        "no-unexpected-multiline": "error",
        "no-unused-labels": "error",
        "no-unused-vars": "off",
        "no-useless-escape": "off",
        "no-var": "error",
        "object-curly-spacing": [
          "error",
          "always"
        ],
        "one-var": [
            "error",
            "never"
        ],
        "radix": "error",
        "require-yield": "off",
        "space-before-function-paren": [
            "error",
            "always"
        ],
        "space-in-parens": [
            "error",
            "never"
        ],
        "spaced-comment": [
            "error",
            "always",
            {
                "markers": [
                    "/"
                ]
            }
        ],
        "@typescript-eslint/no-unused-vars": [
          "off",
          {
            "vars": "all",
            "args": "after-used",
            "argsIgnorePattern": "^_",
            "ignoreRestSiblings": true
          }
        ],
        "use-isnan": "error"
    },
    "settings": {
      "import/resolvers": {
        "typescript": {
          "alwaysTryTypes": true
        }
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".js", ".jsx", ".ts", ".tsx"]
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"]
    }
};
