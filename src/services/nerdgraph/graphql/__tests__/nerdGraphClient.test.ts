import { describe, expect, it, jest } from "@jest/globals";
import { SyntheticsAutomatedTestConfig } from "../../../../lib/interfaces";
import NerdGraphClient from "../nerdGraphClient";
import { GraphQLClient } from "graphql-request";
import {
  GraphqlSyntheticsAutomatedTestResult,
  GraphqlSyntheticsStartAutomatedTestMutationResult,
} from "../interfaces";

jest.mock("graphql-request");
describe("nerdGraphClient", () => {
  const apiKey = "NR-api-key";
  const nerdGraphClient = new NerdGraphClient(apiKey, "STAGING");

  describe("The startAutomatedTests method", () => {
    it("should throw an error if there is an error while starting tests", async () => {
      const graphqlClientRequestSpy = jest
        .spyOn(GraphQLClient.prototype, "request")
        .mockRejectedValue(new Error("An GraphQL error occurred"));
      await expect(
        nerdGraphClient.startAutomatedTests(validConfig),
      ).rejects.toBeInstanceOf(Error);
      expect(graphqlClientRequestSpy).toBeCalled();
    });

    it("should return a batch id", async () => {
      const batchId = "batch-123";
      const graphqlClientRequestSpy = jest
        .spyOn(GraphQLClient.prototype, "request")
        .mockResolvedValue(startTestsMutationResponse);
      const result = await nerdGraphClient.startAutomatedTests(validConfig);
      expect(graphqlClientRequestSpy).toBeCalled();
      expect(result).toBe(batchId);
    });

    it("should return a batch id when result does not exist", async () => {
      const batchId = "batch-123";
      const graphqlClientRequestSpy = jest
        .spyOn(GraphQLClient.prototype, "request")
        .mockResolvedValue(undefined);
      const result = await expect(
        nerdGraphClient.startAutomatedTests(validConfig),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe("The fetchAutomatedTestResults method", () => {
    const accountId = 12345;
    const batchId = "batch-123";
    it("should throw an error if an error occurs while fetching test results", async () => {
      const graphqlClientRequestSpy = jest
        .spyOn(GraphQLClient.prototype, "request")
        .mockRejectedValue(new Error("An GraphQL error occurred"));

      await expect(
        nerdGraphClient.fetchAutomatedTestResults(accountId, batchId),
      ).rejects.toMatchObject({ message: "An GraphQL error occurred" });
      expect(graphqlClientRequestSpy).toBeCalled();
    });

    it("should return test results", async () => {
      const graphqlClientRequestSpy = jest
        .spyOn(GraphQLClient.prototype, "request")
        .mockResolvedValue(testResultQueryResponse);

      const result = await nerdGraphClient.fetchAutomatedTestResults(
        accountId,
        batchId,
      );
      expect(graphqlClientRequestSpy).toBeCalled();
      expect(result.status).toBe("PASSED");
      expect(result.tests.at(0)?.monitorName).toBe("Test-monitor");
    });
  });
});

const startTestsMutationResponse: GraphqlSyntheticsStartAutomatedTestMutationResult =
  {
    syntheticsStartAutomatedTest: { batchId: "batch-123" },
  };

const testResultQueryResponse: GraphqlSyntheticsAutomatedTestResult = {
  actor: {
    account: {
      synthetics: {
        automatedTestResult: {
          tests: [
            {
              batchID: "batch-123",
              duration: 1,
              monitorName: "Test-monitor",
              result: "SUCCESS",
              resultsUrl: "newrelic.com",
              error: "",
            },
          ],
          status: "PASSED",
        },
      },
    },
  },
};

const validConfig: SyntheticsAutomatedTestConfig = {
  tests: [
    {
      monitorGUID:
        "MTAxMTQ5MjV8U1lOVEh8TU9OSVRPUnw4YWE4ZmY4ZS1kNzM5LTQ0YzUtYjBjZS03ZDUyZmQ0ZTQ3MTg",
      config: {
        isBlocking: false,
      },
    },
    {
      monitorGUID:
        "MTAxMTQ5MjV8U1lOVEh8TU9OSVRPUnw5ZmFkZTM5Mi0wNDVjLTQ3ZGQtOWRiNS1lYTg5YmE1MDk2ZGU",
      config: {
        isBlocking: false,
      },
    },
    {
      monitorGUID:
        "MTAxMTQ5MjV8U1lOVEh8TU9OSVRPUnxmMWVmYjE1MS0wNWI1LTQyZmYtYTRjZC1mZTQ0OGNmMWUzYjY",
      config: {
        isBlocking: false,
      },
    },
  ],
  config: {
    platform: "exampleplatform",
    deepLink: "https://newrelic.com",
    batchName: "An automated batch again",
  },
};
