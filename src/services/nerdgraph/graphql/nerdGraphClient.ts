import { START_AUTOMATED_TESTS } from "./mutations";
import { GraphQLClient } from "graphql-request";
import { AUTOMATED_TEST_STATUS } from "./queries";
import {
  SyntheticsAutomatedTestConfig,
  TestResult,
} from "../../../lib/interfaces";
import {
  GraphqlSyntheticsAutomatedTestResult,
  GraphqlSyntheticsStartAutomatedTestMutationResult,
} from "./interfaces";

const US_NERDGRAPH_URL = "https://api.newrelic.com/graphql";
const EU_NERDGRAPH_URL = "https://api.eu.newrelic.com/graphql";
const STAGING_NERDGRAPH_URL = "https://staging-api.newrelic.com/graphql";

const NERDGRAPH_URL_BY_REGION = new Map<string, string>([
  ["STAGING", STAGING_NERDGRAPH_URL],
  ["US", US_NERDGRAPH_URL],
  ["EU", EU_NERDGRAPH_URL],
]);

export default class NerdGraphClient {
  nerdGraphEndpoint = US_NERDGRAPH_URL;
  readonly graphQLClient: GraphQLClient;
  headers: { "API-Key": string };

  constructor(newRelicApiKey: string, region: string) {
    this.nerdGraphEndpoint =
      NERDGRAPH_URL_BY_REGION.get(region) || US_NERDGRAPH_URL;

    this.headers = {
      "API-Key": newRelicApiKey,
    };
    this.graphQLClient = new GraphQLClient(this.nerdGraphEndpoint, {
      headers: {
        "API-Key": newRelicApiKey,
      },
    });
  }

  async startAutomatedTests(
    config: SyntheticsAutomatedTestConfig,
  ): Promise<string> {
    const variables = {
      config: config.config,
      tests: config.tests,
    };
    const result: GraphqlSyntheticsStartAutomatedTestMutationResult =
      await this.graphQLClient.request<GraphqlSyntheticsStartAutomatedTestMutationResult>(
        START_AUTOMATED_TESTS,
        variables,
      );

    return result.syntheticsStartAutomatedTest.batchId;
  }

  async fetchAutomatedTestResults(
    accountId: number,
    batchId: string,
  ): Promise<TestResult> {
    const variables = {
      accountId,
      batchId,
    };

    const result =
      await this.graphQLClient.request<GraphqlSyntheticsAutomatedTestResult>(
        AUTOMATED_TEST_STATUS,
        variables,
      );

    return result.actor.account.synthetics.automatedTestResult;
  }
}
