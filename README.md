# continuous-automated-testing-ci
CLI and library that adds Synthetics Continuous Automated Testing directly into your CICD pipeline!

# Installation
To install the package for use as a library, use your favorite npm-based package manager:

`npm install @newrelic/continuous-automated-testing`

For use as a CLI package, install it globally:

`npm install @newrelic/continuous-automated-testing -g`

# Usage
### CLI

To run a batch of tests when using the package as a CLI, use the run-tests command:

```newrelic-cat run-tests -a <new-relic-api-key> -c <json-config-file-path -v```

The ```run-tests``` command will start a batch of tests based on the config file input.  The results will be displayed once the tests have finished running.

The command has the following options:
 - ```-a, --api-key <value>```: Your New Relic API key.  We suggest using a secrets manager during CI to avoid hardcoding and exposing your API key.
 - ```-c, --config-file-path <value>```: Relative path to a JSON CAT configuration file.  See an example [here](#configuration-file-example).
 - ```-v, --verbose```: See more detail on test results in STDOUT.  When not enabled, only blocking tests will have all details displayed. Can also be added in the [config file](#configuration-file-example).

 ### Library

 After [installing](#installation) the package, import the ```runTestBatch``` function:

 ```import { runTestBatch } from "@newrelic/newrelic-continuous-automated-testing"```

 The function takes the following parameters:

 - ```apiKey```: A New Relic API key.
 - ```config```: A JSON CAT configuration file.  See an example [here](#configuration-file-example).


## Configuration File Example
```
{
    "accountId": 12345,                     // Required
    "region": "US",                         // Required, options: US, EU
    "verbose": true,                        // Optional, default: false
    "tests": [                              // Array of tests to run
      {
        "monitorGuid": "monitor-GUID-1",    // Required
        "config": {                         // All config fields optional
          "isBlocking": true,
          "overrides":{

          }
        }
      },
      {
        "monitorGuid": "monitor-GUID-2"     // Required
      }
  ],
    "config": {                             // All config fields optional
        "batchName": "Test Batch"
    }
  }
  
```