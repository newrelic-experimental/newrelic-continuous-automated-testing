import { describe, expect, it, jest } from "@jest/globals";
import NerdGraphService from "../nerdGraphService";
import NerdGraphClient from "../graphql/nerdGraphClient";
import {
  SyntheticsAutomatedTestConfig,
  TestResult,
} from "../../../lib/interfaces";
jest.useFakeTimers();

describe("NerdGraphService", () => {
  const apiKey = "new-relic-api-key-123";
  const nerdGraphService = new NerdGraphService(apiKey, "STAGING");

  describe("The startAutomatedTests method", () => {
    const config: SyntheticsAutomatedTestConfig = {
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

    it("should throw an error when an error occurs when starting tests", async () => {
      const batchId = "batch-123";

      const startAutomatedTestsSpy = jest
        .spyOn(NerdGraphClient.prototype, "startAutomatedTests")
        .mockRejectedValue(new Error("An error occurred"));

      await expect(
        nerdGraphService.startAutomatedTests(config),
      ).rejects.toMatchObject({ message: "An error occurred" });
      expect(startAutomatedTestsSpy).toHaveBeenCalled();
    });

    it("should return a batchId string", async () => {
      const batchId = "batch-123";

      const startAutomatedTestsSpy = jest
        .spyOn(NerdGraphClient.prototype, "startAutomatedTests")
        .mockResolvedValue(batchId);

      const result = await nerdGraphService.startAutomatedTests(config);
      expect(startAutomatedTestsSpy).toHaveBeenCalled();
      expect(typeof result).toBe("string");
      expect(result).toBe(batchId);
    });
  });

  describe("The pollAutomatedTestResults method", () => {
    it("should throw when there is an error while fetching test results", async () => {
      const batchId = "batch-123";
      const accountId = 12345;

      const pollAutomatedTestResultsSpy = jest
        .spyOn(NerdGraphClient.prototype, "fetchAutomatedTestResults")
        .mockRejectedValue(new Error("An error occurred"));

      await expect(
        nerdGraphService.pollAutomatedTestResults(accountId, batchId),
      ).rejects.toMatchObject({ message: "An error occurred" });
      expect(pollAutomatedTestResultsSpy).toHaveBeenCalled();
    });

    it("should return a list of test results when given accountId and batchId", async () => {
      const batchId = "batch-123";
      const accountId = 12345;
      const mockTestResults: TestResult = {
        status: "SUCCESS",
        tests: [],
      };

      const pollAutomatedTestResultsSpy = jest
        .spyOn(NerdGraphClient.prototype, "fetchAutomatedTestResults")
        .mockResolvedValue(mockTestResults);

      const result = await nerdGraphService.pollAutomatedTestResults(
        accountId,
        batchId,
      );
      expect(pollAutomatedTestResultsSpy).toHaveBeenCalled();
      expect(result).toBe(mockTestResults);
    });

    it("should poll until the tests are no longer IN_PROGRESS", async () => {
      const batchId = "batch-123";
      const accountId = 12345;
      const mockInProgressTestResults: TestResult = {
        status: "IN_PROGRESS",
        tests: [],
      };
      const mockSuccessTestResults: TestResult = {
        status: "SUCCESS",
        tests: [],
      };

      const pollAutomatedTestResultsSpy = jest
        .spyOn(NerdGraphClient.prototype, "fetchAutomatedTestResults")
        .mockResolvedValueOnce(mockInProgressTestResults)
        .mockResolvedValueOnce(mockInProgressTestResults)
        .mockResolvedValueOnce(mockInProgressTestResults)
        .mockResolvedValue(mockSuccessTestResults);

      const pollAutomatedTestResultsPromise =
        nerdGraphService.pollAutomatedTestResults(accountId, batchId);
      await jest.runAllTimersAsync();
      const result = await pollAutomatedTestResultsPromise;
      expect(pollAutomatedTestResultsSpy).toHaveBeenCalledTimes(4);
      expect(result).toBe(mockSuccessTestResults);
    });
  });
});
