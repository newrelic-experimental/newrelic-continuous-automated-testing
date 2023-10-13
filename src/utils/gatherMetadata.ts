import { ContinuousTestingConfiguration } from "../lib/interfaces";

export async function addMetadataToConfig(
  inputConfig: ContinuousTestingConfiguration,
) {
  if (!inputConfig.config) {
    inputConfig.config = {};
  }

  if (process.env.JENKINS_HOME) {
    inputConfig.config.branch = process.env.GIT_BRANCH;
    inputConfig.config.commit = process.env.GIT_COMMIT;
    inputConfig.config.repository = process.env.GIT_URL;
  }

  if (process.env.GITHUB_ACTIONS) {
    inputConfig.config.branch = process.env.GITHUB_REF;
    inputConfig.config.commit = process.env.GITHUB_SHA;
    inputConfig.config.repository = process.env.GITHUB_REPOSITORY;
  }

  if (process.env.GITLAB_CI) {
    inputConfig.config.branch = process.env.CI_COMMIT_BRANCH;
    inputConfig.config.commit = process.env.CI_COMMIT_SHA;
    inputConfig.config.repository = process.env.CI_REPOSITORY_URL;
  }
}
