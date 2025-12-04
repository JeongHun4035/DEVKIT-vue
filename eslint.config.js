import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import vuePlugin from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default [
  // 무시 경로
  {
    ignores: [
      '**/node_modules/**',
      '.output/**',
      'dist/**',
      'coverage/**',
      '.vite-cache/**',
    ],
  },

  // 기본 추천 세트
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],

  // 공통(전역) 규칙 + 스타일(@stylistic)
  {
    plugins: {
      '@stylistic': stylistic,
      import: importPlugin,
      'unused-imports': unusedImports,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        // 프로젝트 고유 전역만 여기에 추가
        storeToRefs: 'readonly',
      },
    },
    rules: {
      // ===== 스타일(@stylistic) → Prettier 대체 =====
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': [
        'error',
        'single',
        { avoidEscape: true },
      ],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/indent': [
        'error',
        2,
        { SwitchCase: 1 },
      ],
      '@stylistic/object-curly-newline': [
        'error',
        {
          multiline: true,
          consistent: true,
        },
      ],
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],

      '@stylistic/array-bracket-newline': [
        'error',
        {
          multiline: true,
          minItems: 3,
        },
      ],
      '@stylistic/array-element-newline': [
        'error',
        {
          multiline: true,
          minItems: 3,
        },
      ],

      '@stylistic/function-paren-newline': ['error', 'multiline'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],

      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],

      '@stylistic/operator-linebreak': [
        'error',
        'before',
        {
          overrides: {
            '=': 'after',
            '?': 'after',
            ':': 'after',
          },
        },
      ],
      '@stylistic/max-len': 'off',
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'always-multiline',
        },
      ],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/brace-style': 'error',
      '@stylistic/arrow-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],
      '@stylistic/template-curly-spacing': 'error',
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        },
      ],

      // TypeScript 관련
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'property',
          format: null,
        },
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],

      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'enum 사용 금지 - union type 또는 const 객체 사용 권장',
        },
      ],

      // import 관련
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node 내장
            'external', // 외부 패키지
            'internal', // 소스 내부(alias 등)
            ['parent', 'sibling'], // 상대경로
            'index', // 현재 폴더의 index
            'type', // 타입 전용 import
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // TS 쓸 거니까 no-undef는 끔
      'no-undef': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json'],
          tsconfigRootDir: process.cwd(),
          alwaysTryTypes: true,
        },
        node: {
          extensions: [
            '.js',
            '.ts',
            '.d.ts',
            '.vue',
            '.json',
          ],
        },
      },
    },
  },

  // JS/TS 전용
  {
    files: ['**/*.{js,ts}'],
    languageOptions: { parser: tseslint.parser },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Vue SFC 전용
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1,
        },
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
        },
      ],
      'vue/block-order': [
        'error',
        {
          order: [
            'script',
            'template',
            'style',
          ],
        },
      ],
      'vue/html-indent': [
        'error',
        2,
        {
          baseIndent: 1,
          attribute: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
        },
      ],

      'vue/no-multi-spaces': ['error', { ignoreProperties: false }],
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',

      // setup props destructure 허용
      'vue/no-setup-props-destructure': 'off',

      // 이름 규칙 완화
      'vue/multi-word-component-names': 'off',

      // script 블록 인덴트는 stylistic/indent가 담당
      'vue/script-indent': 'off',

      // unused import/vars
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]
