import { InputError, INPUT_ERROR } from "../lib/errors/InputError";
import { ContinuousTestingConfiguration } from "../lib/interfaces";

const validRegions = ["US", "EU", "STAGING"];

export async function validateInput(
  apiKey: string,
  config: ContinuousTestingConfiguration,
) {
  if (isNullUndefined(apiKey) || apiKey.length === 0) {
    throw new InputError(INPUT_ERROR.API_KEY_INVALID);
  }

  if (isNullUndefined(config)) {
    throw new InputError(INPUT_ERROR.CONFIG_NOT_FOUND);
  }

  if (isNullUndefined(config.accountId) || config.accountId === 0) {
    throw new InputError(INPUT_ERROR.ACCOUNT_ID_INVALID);
  }

  if (isNullUndefined(config.region) || !validRegions.includes(config.region)) {
    throw new InputError(INPUT_ERROR.REGION_INVALID);
  }

  if (config.tests.length < 1) {
    throw new InputError(INPUT_ERROR.NO_TESTS);
  }
}

function isNullUndefined(value: unknown): boolean {
  return value === null || value === undefined;
}
