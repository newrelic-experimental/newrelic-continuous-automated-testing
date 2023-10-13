import { gql } from "graphql-request";

export const START_AUTOMATED_TESTS = gql`
  mutation (
    $config: SyntheticsAutomatedTestConfigInput
    $tests: [SyntheticsAutomatedTestMonitorInput]
  ) {
    syntheticsStartAutomatedTest(config: $config, tests: $tests) {
      batchId
    }
  }
`;
