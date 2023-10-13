import { describe, expect, it, jest } from "@jest/globals";
import { runTestBatch } from "../runTestBatch";
import {
  ContinuousTestingConfiguration,
  SyntheticsAutomatedTestConfig,
  SyntheticsAutomatedTestConfigInput,
  TestResult,
  TestResultStatuses,
} from "../interfaces";
import NerdGraphService from "../../services/nerdgraph/nerdGraphService";
import { afterEach } from "node:test";
import * as gatherMetadata from "../../utils/gatherMetadata";
jest.useFakeTimers();
jest.mock("../../services/nerdgraph/nerdGraphService");
jest.mock("../../utils/gatherMetadata");

describe("The runSynthetics function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const apiKey = "NR-apiKey-123";
  const mockConfigInput: SyntheticsAutomatedTestConfigInput = {
    batchName: "Test-batch",
  };

  const mockConfig: ContinuousTestingConfiguration = {
    apiKey: "NR-apiKey-123",
    accountId: 1234,
    verbose: true,
    region: "US",
    tests: [
      {
        monitorGUID: "monitor-guid-123",
      },
    ],
    config: mockConfigInput,
  };

  //   const addMetadataToConfigSpy = jest
  //     .spyOn(gatherMetadata, "addMetadataToConfig")
  //     .mockResolvedValue(mockConfig);

  const pollAutomatedTestResultsSpy = jest.spyOn(
    NerdGraphService.prototype,
    "pollAutomatedTestResults",
  );

  it("should catch and log an error that was thrown when starting tests, retry 5 more times, then throw a less specific error", async () => {
    const startAutomatedTestsSpy = jest.spyOn(
      NerdGraphService.prototype,
      "startAutomatedTests",
    );
    startAutomatedTestsSpy.mockRejectedValue(new Error("oops"));
    const runSyntheticsPromise = runTestBatch(apiKey, mockConfig);
    jest.runAllTimersAsync();
    await expect(runSyntheticsPromise).rejects.toThrow();
    expect(startAutomatedTestsSpy).toBeCalledTimes(6);
  });

  it("should start the tests, then return the results when result is PASSED", async () => {
    const startAutomatedTestsSpy = jest.spyOn(
      NerdGraphService.prototype,
      "startAutomatedTests",
    );
    const expectedAutomatedTestConfig: SyntheticsAutomatedTestConfig = {
      tests: mockConfig.tests,
      config: mockConfig.config,
    };
    startAutomatedTestsSpy.mockResolvedValueOnce(mockBatchId);
    pollAutomatedTestResultsSpy.mockResolvedValueOnce(mockTestResultsPassed);
    const runSyntheticsPromise = runTestBatch(apiKey, mockConfig);
    jest.runAllTimersAsync();
    const result = await runSyntheticsPromise;
    expect(startAutomatedTestsSpy).toHaveBeenCalledTimes(1);
    expect(startAutomatedTestsSpy).toHaveBeenCalledWith(
      expectedAutomatedTestConfig,
    );
    expect(pollAutomatedTestResultsSpy).toHaveBeenCalledTimes(1);
    expect(pollAutomatedTestResultsSpy).toHaveBeenLastCalledWith(
      mockConfig.accountId,
      mockBatchId,
    );
    expect(result?.status).toBe(TestResultStatuses.PASSED);
    expect(result?.tests.length).toBe(1);
  });

  it("should start the tests, then return the results when result is FAILURE", async () => {
    const startAutomatedTestsSpy = jest.spyOn(
      NerdGraphService.prototype,
      "startAutomatedTests",
    );
    const expectedAutomatedTestConfig: SyntheticsAutomatedTestConfig = {
      tests: mockConfig.tests,
      config: mockConfig.config,
    };
    startAutomatedTestsSpy.mockResolvedValueOnce(mockBatchId);
    pollAutomatedTestResultsSpy.mockResolvedValueOnce(mockTestResultsFailure);
    const runSyntheticsPromise = runTestBatch(apiKey, mockConfig);
    jest.runAllTimersAsync();
    const result = await runSyntheticsPromise;
    expect(startAutomatedTestsSpy).toHaveBeenCalledTimes(1);
    expect(startAutomatedTestsSpy).toHaveBeenCalledWith(
      expectedAutomatedTestConfig,
    );
    expect(pollAutomatedTestResultsSpy).toHaveBeenCalledTimes(1);
    expect(pollAutomatedTestResultsSpy).toHaveBeenLastCalledWith(
      mockConfig.accountId,
      mockBatchId,
    );
    expect(result?.status).toBe("FAILURE");
    expect(result?.tests.length).toBe(3);
  });

  it("should add metadata config based on the environment before starting tests", async () => {
    const startAutomatedTestsSpy = jest.spyOn(
      NerdGraphService.prototype,
      "startAutomatedTests",
    );
    const expectedAutomatedTestConfig: SyntheticsAutomatedTestConfig = {
      tests: mockConfig.tests,
      config: mockConfig.config,
    };
    startAutomatedTestsSpy.mockResolvedValueOnce(mockBatchId);
    pollAutomatedTestResultsSpy.mockResolvedValueOnce(mockTestResultsFailure);
    const runSyntheticsPromise = runTestBatch(apiKey, mockConfig);
    jest.runAllTimersAsync();
    const result = await runSyntheticsPromise;
    expect(startAutomatedTestsSpy).toHaveBeenCalledTimes(1);
    expect(startAutomatedTestsSpy).toHaveBeenCalledWith(
      expectedAutomatedTestConfig,
    );
    expect(pollAutomatedTestResultsSpy).toHaveBeenCalledTimes(1);
    expect(pollAutomatedTestResultsSpy).toHaveBeenLastCalledWith(
      mockConfig.accountId,
      mockBatchId,
    );
    expect(result?.status).toBe("FAILURE");
    expect(result?.tests.length).toBe(3);
  });

  it("should return all results when verbose logging is not present in the config file", async () => {
    const startAutomatedTestsSpy = jest.spyOn(
      NerdGraphService.prototype,
      "startAutomatedTests",
    );
    const mockConfigCopy = mockConfig;
    delete mockConfigCopy.verbose;

    const expectedAutomatedTestConfig: SyntheticsAutomatedTestConfig = {
      tests: mockConfigCopy.tests,
      config: mockConfigCopy.config,
    };
    startAutomatedTestsSpy.mockResolvedValueOnce(mockBatchId);
    pollAutomatedTestResultsSpy.mockResolvedValueOnce(mockTestResultsFailure);
    const runSyntheticsPromise = runTestBatch(apiKey, mockConfigCopy);
    jest.runAllTimersAsync();
    const result = await runSyntheticsPromise;
    expect(startAutomatedTestsSpy).toHaveBeenCalledTimes(1);
    expect(startAutomatedTestsSpy).toHaveBeenCalledWith(
      expectedAutomatedTestConfig,
    );
    expect(pollAutomatedTestResultsSpy).toHaveBeenCalledTimes(1);
    expect(pollAutomatedTestResultsSpy).toHaveBeenLastCalledWith(
      mockConfigCopy.accountId,
      mockBatchId,
    );
    expect(result?.status).toBe("FAILURE");
    expect(result?.tests.length).toBe(3);
  });
});

const mockBatchId = "batch-1234";

const mockTestResultsPassed: TestResult = {
  status: "PASSED",
  tests: [
    {
      monitorName: "monitor name",
      batchID: mockBatchId,
      duration: 1,
      error: "",
      result: "SUCCESS",
      resultsUrl: "www.newrelic.com",
      automatedTestMonitorConfig: {
        isBlocking: false,
      },
    },
  ],
};

const mockTestResultsFailure: TestResult = {
  status: "FAILURE",
  tests: [
    {
      monitorName: "monitor name 1",
      batchID: mockBatchId,
      duration: 1,
      error: "",
      result: "SUCCESS",
      resultsUrl: "www.newrelic.com",
      automatedTestMonitorConfig: {
        isBlocking: false,
      },
    },
    {
      monitorName: "monitor name 2",
      batchID: mockBatchId,
      duration: 1,
      error: "",
      result: "FAILURE",
      resultsUrl: "www.newrelic.com",
      automatedTestMonitorConfig: {
        isBlocking: true,
      },
    },
    {
      monitorName: "monitor name 3",
      batchID: mockBatchId,
      duration: 1,
      error: "",
      result: "FAILURE",
      resultsUrl: "www.newrelic.com",
    },
  ],
};
