import { gql } from "graphql-request";

export const AUTOMATED_TEST_STATUS = gql`
  query SyntheticsAutomatedTestResult($accountId: Int!, $batchId: String!) {
    actor {
      account(id: $accountId) {
        synthetics {
          automatedTestResult(batchId: $batchId) {
            status
            tests {
              error
              automatedTestMonitorConfig {
                isBlocking
                overrides {
                  domain {
                    domain
                  }
                  location
                  secureCredential {
                    key
                  }
                  startingUrl
                }
              }
              batchId
              duration
              monitorName
              result
              resultsUrl
            }
          }
        }
      }
    }
  }
`;
