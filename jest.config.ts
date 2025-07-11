import { Config } from "jest";

const config: Config = {
  preset: "ts-jest", //test using ts
  testEnvironment: "node", //env test
  verbose: true, //show individual test results
  //     collectCoverage:true,
  //   coverageDirectory:"coverage",
  // coveragePathIgnorePatterns:[
  //   "/node_modules",
  //   "src/Drizzle/schema.ts",
  //   "src/Drizzle/db.ts"
  // ]
  testTimeout: 30000, //30 seconds timeout for each test
};

export default config;
