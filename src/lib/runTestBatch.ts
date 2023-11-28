import NerdGraphService from "../services/nerdgraph/nerdGraphService";
import {
  ContinuousAutomatedTestingResults,
  ContinuousTestingConfiguration,
  SyntheticsAutomatedTestConfig,
  TestResult,
} from "./interfaces";
import ora, { promise } from "ora";
import {
  addMetadataToConfig,
  generateBatchUrl,
  outputResults,
  wait,
  validateInput,
} from "../utils";
import retry from "async-retry";

export async function runTestBatch(
  apiKey: string,
  config: ContinuousTestingConfiguration,
) {
  try {
    await validateInput(apiKey, config);
    await addMetadataToConfig(config);

    const nerdGraphService = new NerdGraphService(apiKey, config.region);
    const nerdGraphTestConfig: SyntheticsAutomatedTestConfig = {
      tests: config.tests,
      config: config.config,
    };

    const startTestPromise: Promise<string> = retry(
      async () => {
        return await nerdGraphService.startAutomatedTests(nerdGraphTestConfig);
      },
      { retries: 5 },
    );

    promise(startTestPromise, {
      spinner: "dots",
      text: "Starting automated tests",
    });

    const batchId = await startTestPromise;

    if (!batchId) {
      throw new Error("Unable to start tests");
    }

    const batchUrl = await generateBatchUrl(batchId, config);

    const waitingForResultsSpinner = ora(
      `Waiting for test results of batch: ${batchId}`,
    ).start();

    await wait(40000);

    const testResults: TestResult = await retry(
      async () => {
        return await nerdGraphService.pollAutomatedTestResults(
          config.accountId,
          batchId,
        );
      },
      {
        retries: 5,
        minTimeout: 5000,
        maxTimeout: 5000,
      },
    );

    waitingForResultsSpinner.succeed();

    const verboseLogging = config.verbose || false;

    await outputResults(batchId, batchUrl, testResults, verboseLogging);

    const continuousAutomatedTestingResults: ContinuousAutomatedTestingResults =
      {
        batchId: batchId,
        batchUrl: batchUrl,
        status: testResults.status,
        tests: testResults.tests,
      };

    return continuousAutomatedTestingResults;
  } catch (error) {
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage = `Error occurred while running tests: ${error.message}`;
    }
    process.stderr.write(errorMessage);
    throw new Error(errorMessage);
  }
}
