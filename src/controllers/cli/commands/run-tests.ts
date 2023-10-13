#! /usr/bin/env node

import { Command } from "commander";
import {
  ContinuousTestingConfiguration,
  TestResultStatuses,
} from "../../../lib/interfaces";
import { runTestBatch } from "../../../lib/runTestBatch";
import fs from "fs";

export const runTestsCommand = new Command("run-tests");

runTestsCommand
  .description("Run specified Synthetics tests")
  .option(
    "-c, --config-file-path <value>",
    "Relative path to configuration file",
  )
  .option("-a, --api-key <value>", "New Relic API Key")
  .option(
    "-v, --verbose",
    "Output more details for each test result, not just failures",
  )
  .action(async (options) => {
    try {
      if (options.configFilePath) {
        const confFile = fs.readFileSync(options.configFilePath);
        const inputConfigFile: ContinuousTestingConfiguration = JSON.parse(
          confFile.toString(),
        );

        const cliOpts = {
          apiKey: options.apiKey,
          verbose: options.verbose,
        };

        const combinedConfigFile = merge(inputConfigFile, cliOpts);

        const results = await runTestBatch(
          combinedConfigFile.apiKey || options.apiKey,
          combinedConfigFile,
        );

        if (results.status !== TestResultStatuses.PASSED) {
          process.exitCode = 1;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        process.stdout.write(error.message);
      }
      process.exitCode = 1;
    }
    process.exit();
  });

export function merge(
  orig: ContinuousTestingConfiguration,
  config?: Partial<ContinuousTestingConfiguration>,
) {
  return { ...orig, ...config };
}
