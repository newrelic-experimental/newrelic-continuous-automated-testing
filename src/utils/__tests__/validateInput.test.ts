import { describe, expect, it } from "@jest/globals";
import { validateInput } from "../validateInput";
import { ContinuousTestingConfiguration } from "../../lib/interfaces";
import { INPUT_ERROR, InputError } from "../../lib/errors/InputError";

describe("The validateInput method", () => {
  it("should throw an InputError when apiKey is not present", async () => {
    await expect(validateInput("", mockConfig)).rejects.toThrow(
      new InputError(INPUT_ERROR.API_KEY_INVALID),
    );
  });

  it("should throw an InputError when accountId is 0", async () => {
    await expect(validateInput("123", mockConfig)).rejects.toThrow(
      new InputError(INPUT_ERROR.ACCOUNT_ID_INVALID),
    );
  });

  it("should throw an InputError when region is not present", async () => {
    mockConfig.accountId = 123;
    await expect(validateInput("123", mockConfig)).rejects.toThrow(
      new InputError(INPUT_ERROR.REGION_INVALID),
    );
  });
});

let mockConfig: ContinuousTestingConfiguration = {
  accountId: 0,
  region: "",
  tests: [{ monitorGUID: "123" }],
};
