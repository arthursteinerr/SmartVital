const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true, // Permite que os mocks anteriores não contaminem os outros

  // Permite fazer importacoes genericas
  modulePaths: ["<rootDir>/src"],

  // Coloca todos os testes dentro de "/testes/"
  testMatch: [
    "**/tests/**/*.test.ts",
  ],

  // O Jest não entende TS, por isso precisa traduzir para JS e aplicar o source-maps e depois executar o teste traduzido.
  // O Source-maps, permite identificar os erros que acontece nas traducoes em JS e apontar exatamente onde corresponde no TS.
  transform: {
    ...tsJestTransformCfg,
  },

  moduleFileExtensions: ["ts", "js"],

  // Geração de cobertura
  collectCoverage: true, // Gera relatorios automaticamente por meio do Jest
  collectCoverageFrom: ["src/**/*.ts"],
  // Evita medir cobertura de arquivos compilados ou de bibliotecas
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/tests/",
  ],

  // Setup para variáveis de ambiente e bibliotecas antes dos testes
  setupFiles: ["<rootDir>/tests/setup/env.setup.ts"],
};