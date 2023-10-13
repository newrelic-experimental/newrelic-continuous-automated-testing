import chalk from "chalk";
import {
  AutomatedTest,
  TestResult,
  AutomatedTestResults,
  TestResultStatuses,
} from "../lib/interfaces";

export async function outputResults(
  batchId: string,
  batchUrl: string,
  testResults: TestResult,
  verboseLogging: boolean,
) {
  if (testResults.status === TestResultStatuses.TIMEOUT) {
    process.stderr.write(
      `${chalk.red(`A timeout occurred while running automated test batch, please try again.\nView detailed results: ${batchUrl}`)}`,
    );
    return;
  }

  let countSuccess = 0,
    countFailure = 0,
    countBlockingFailure = 0;
  const blockingFailures: Array<string> = [],
    printableResults: Array<string> = [];

  await testResults.tests.forEach(async (test: AutomatedTest) => {
    const stringResult = await buildTestResultString(test, verboseLogging);
    printableResults.push(stringResult);
    if (test.result === AutomatedTestResults.SUCCESS) {
      countSuccess++;
    } else {
      countFailure++;
      if (test.automatedTestMonitorConfig?.isBlocking) {
        countBlockingFailure++;
        blockingFailures.push(stringResult);
      }
    }
  });

  const summaryString = await buildSummaryString(
    batchId,
    testResults.status,
    batchUrl,
    countSuccess,
    countFailure,
    countBlockingFailure,
  );
  writeLine(summaryString);

  printableResults.forEach((resultString) => {
    writeLine(resultString);
  });

  if (blockingFailures.length > 0) {
    writeLine(chalk.red(`\nThere were failed blocking tests: `));
    writeLine(chalk.red("-".repeat(process.stdout.columns)));
    blockingFailures.forEach((blockingFailure) => {
      writeLine(blockingFailure);
    });
    writeLine(chalk.red("-".repeat(process.stdout.columns)));
  }

  writeLine(summaryString);
}

async function buildSummaryString(
  batchId: string,
  batchStatus: string,
  batchUrl: string,
  countSuccess: number,
  countFailure: number,
  countBlockingFailure: number,
): Promise<string> {
  let summaryString = ``;

  summaryString += "-".repeat(process.stdout.columns) + "\n";
  summaryString += `New Relic Synthetic Test Results for batch ${batchId}: ${batchStatus}\n`;

  summaryString += `Total: ${countSuccess + countFailure}, ${chalk.green(
    "Passed: " + countSuccess,
  )}, ${chalk.red("Failed: " + countFailure)} ${chalk.bgRed(
    "(" + countBlockingFailure + " blocking)",
  )} \n`;
  summaryString += `View detailed results: ${batchUrl}\n`;
  summaryString += "-".repeat(process.stdout.columns) + "\n";
  return summaryString;
}

async function buildTestResultString(
  testResult: AutomatedTest,
  verboseLogging: boolean,
): Promise<string> {
  let stringResult = ``;

  let descriptiveFontColor = chalk.red;
  let resultIcon = "\u2718";
  const bulletedListIcon = "\u274d";
  if (testResult.result === AutomatedTestResults.SUCCESS) {
    descriptiveFontColor = chalk.green;
    resultIcon = "\u2713";
  }

  stringResult += `${descriptiveFontColor(resultIcon)} ${
    testResult.monitorName
  }\n`;

  if (verboseLogging || testResult.automatedTestMonitorConfig?.isBlocking) {
    stringResult += `\t${bulletedListIcon} Blocking: ${chalk.dim(
      testResult.automatedTestMonitorConfig?.isBlocking || false,
    )}\n`;
    stringResult += `\t${bulletedListIcon} View detailed results: ${chalk.dim(
      testResult.resultsUrl,
    )}\n`;
  }

  return stringResult;
}

async function writeLine(input: string) {
  process.stdout.write(`${input}\n`);
}
