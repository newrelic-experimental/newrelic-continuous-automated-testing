import { ContinuousTestingConfiguration } from "../lib/interfaces";

const STAGING_HOST = "https://staging-one.newrelic.com";
const PRD_US_HOST = "https://one.newrelic.com";
const PRD_EU_HOST = "https://one.eu.newrelic.com";

export const NERDGRAPH_URL_BY_REGION = new Map<string, string>([
  ["STAGING", STAGING_HOST],
  ["US", PRD_US_HOST],
  ["EU", PRD_EU_HOST],
]);

export async function generateBatchUrl(
  batchId: string,
  config: ContinuousTestingConfiguration,
) {
  const json = {
    nerdletId: "automated-testing.batch-detail-list",
    accountId: config.accountId,
    batchId: batchId,
  };

  const encodedPane = btoa(JSON.stringify(json));

  return `${NERDGRAPH_URL_BY_REGION.get(
    config.region,
  )}/launcher/automated-testing.batch-detail-list?pane=${encodedPane}`;
}
