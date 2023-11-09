export interface ContinuousTestingConfiguration {
  accountId: number;
  apiKey?: string;
  region: string;
  verbose?: boolean;
  tests: [SyntheticsAutomatedTestMonitorInput];
  config?: SyntheticsAutomatedTestConfigInput;
}

export interface SyntheticsAutomatedTestConfig {
  tests: SyntheticsAutomatedTestMonitorInput[];
  config?: SyntheticsAutomatedTestConfigInput;
}

export interface SyntheticsAutomatedTestConfigInput {
  branch?: string;
  commit?: string;
  platform?: string;
  deepLink?: string;
  batchName?: string;
  repository?: string;
}

export interface SyntheticsAutomatedTestMonitorInput {
  monitorGUID: string;
  config?: SyntheticsAutomatedTestMonitorConfigInput;
}

export interface SyntheticsAutomatedTestMonitorConfigInput {
  isBlocking?: boolean;
  overrides?: SyntheticsAutomatedTestOverridesInput;
}

export interface SyntheticsAutomatedTestOverridesInput {
  domain?: SyntheticScriptDomainOverrideInput[];
  location?: string;
  secureCredential?: SyntheticsSecureCredentialOverrideInput[];
  startingUrl?: string;
}

export interface SyntheticScriptDomainOverrideInput {
  domain: string;
  override: string;
}

export interface SyntheticsSecureCredentialOverrideInput {
  key: string;
  overrideKey: string;
}

export interface ContinuousAutomatedTestingResults {
  batchId: string;
  batchUrl: string;
  status: string;
  tests: AutomatedTest[];
}

export interface TestResult {
  status: string;
  tests: AutomatedTest[];
}

export interface AutomatedTest {
  automatedTestMonitorConfig?: AutomatedTestMonitorConfig;
  batchID: string;
  duration: number;
  error?: string;
  monitorName: string;
  result: string;
  resultsUrl: string;
}

export interface AutomatedTestMonitorConfig {
  isBlocking?: boolean;
  overrides?: AutomatedTestMonitorConfigOverrides;
}

export interface AutomatedTestMonitorConfigOverrides {
  domain?: DomainOverride[];
  location?: string;
  secureCredential?: SecureCredentialOverride[];
  startingUrl?: string;
}

export interface DomainOverride {
  domain?: string;
  override?: string;
}

export interface SecureCredentialOverride {
  key?: string;
  overrideKey?: string;
}

export enum TestResultStatuses {
  PASSED = "PASSED",
  TIMEOUT = "TIMEOUT",
}

export enum AutomatedTestResults {
  SUCCESS = "SUCCESS",
}
