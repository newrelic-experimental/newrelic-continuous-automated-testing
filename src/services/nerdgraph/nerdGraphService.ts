import NerdGraphClient from "./graphql/nerdGraphClient";
import { wait } from "../../utils";
import {
  SyntheticsAutomatedTestConfig,
  TestResult,
} from "../../lib/interfaces";

const IN_PROGRESS_STATUS = "IN_PROGRESS";

export default class NerdGraphService {
  apiKey: string;
  nerdgraphClient: NerdGraphClient;

  constructor(newRelicApiKey: string, region: string) {
    this.apiKey = newRelicApiKey;
    this.nerdgraphClient = new NerdGraphClient(newRelicApiKey, region);
  }

  async startAutomatedTests(
    config: SyntheticsAutomatedTestConfig,
  ): Promise<string> {
    return await this.nerdgraphClient.startAutomatedTests(config);
  }

  async pollAutomatedTestResults(
    accountId: number,
    batchId: string,
  ): Promise<TestResult> {
    let result = await this.nerdgraphClient.fetchAutomatedTestResults(
      accountId,
      batchId,
    );

    let status = result.status;
    while (status === IN_PROGRESS_STATUS) {
      await wait(5000);
      result = await this.nerdgraphClient.fetchAutomatedTestResults(
        accountId,
        batchId,
      );
      status = result.status;
    }
    return result;
  }
}
