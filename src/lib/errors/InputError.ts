export const INPUT_ERROR = {
  ACCOUNT_ID_INVALID: "accountId missing or invalid",
  API_KEY_INVALID: "apiKey missing or invalid",
  CONFIG_NOT_FOUND: "Configuration file not found",
  NERDGRAPH_URL_INVALID: "nerdGraphUrl missing or invalid",
  NO_TESTS: "No tests defined in configuration file",
  REGION_INVALID: "region missing or invalid, valid options are US or EU",
} as const;

type inputErrorValue = (typeof INPUT_ERROR)[keyof typeof INPUT_ERROR];

export class InputError extends Error {
  constructor(message: inputErrorValue) {
    super(message.toString());
  }
}
