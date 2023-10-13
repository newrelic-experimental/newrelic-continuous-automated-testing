import { TestResult } from "../../../lib/interfaces";

export interface GraphqlSyntheticsStartAutomatedTestMutationResult {
  syntheticsStartAutomatedTest: SyntheticsStartAutomatedTest;
}

export interface SyntheticsStartAutomatedTest {
  batchId: string;
}

export interface GraphqlSyntheticsAutomatedTestResult {
  actor: Actor;
}

export interface Actor {
  account: Account;
}

export interface Account {
  synthetics: Synthetics;
}

export interface Synthetics {
  automatedTestResult: TestResult;
}
