<a href="https://opensource.newrelic.com/oss-category/#new-relic-experimental"><picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/newrelic/opensource-website/raw/main/src/images/categories/dark/Experimental.png"><source media="(prefers-color-scheme: light)" srcset="https://github.com/newrelic/opensource-website/raw/main/src/images/categories/Experimental.png"><img alt="New Relic Open Source experimental project banner." src="https://github.com/newrelic/opensource-website/raw/main/src/images/categories/Experimental.png"></picture></a>

# newrelic-continuous-automated-testing
![GitHub forks](https://img.shields.io/github/forks/newrelic-experimental/newrelic-continuous-automated-testing?style=social)
![GitHub stars](https://img.shields.io/github/stars/newrelic-experimental/newrelic-continuous-automated-testing?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/newrelic-experimental/newrelic-continuous-automated-testing?style=social)

![GitHub all releases](https://img.shields.io/github/downloads/newrelic-experimental/newrelic-continuous-automated-testing/total)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/newrelic-experimental/newrelic-continuous-automated-testing)
![GitHub last commit](https://img.shields.io/github/last-commit/newrelic-experimental/newrelic-continuous-automated-testing)
![GitHub Release Date](https://img.shields.io/github/release-date/newrelic-experimental/newrelic-continuous-automated-testing)


![GitHub issues](https://img.shields.io/github/issues/newrelic-experimental/newrelic-continuous-automated-testing)
![GitHub issues closed](https://img.shields.io/github/issues-closed/newrelic-experimental/newrelic-continuous-automated-testing)
![GitHub pull requests](https://img.shields.io/github/issues-pr/newrelic-experimental/newrelic-continuous-automated-testing)
![GitHub pull requests closed](https://img.shields.io/github/issues-pr-closed/newrelic-experimental/newrelic-continuous-automated-testing)


>CLI and library that adds Synthetics Continuous Automated Testing directly into your CICD pipeline!

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
 - ```-c, --config-file-path <value>```: Relative path to a JSON CAT configuration file.  See an example [here](#example-configuration-file).
 - ```-v, --verbose```: See more detail on test results in STDOUT.  When not enabled, only blocking tests will have all details displayed. Can also be added in the [config file](#example-configuration-file).

 ### Library

 After [installing](#installation) the package, import the ```runTestBatch``` function:

 ```import { runTestBatch } from "@newrelic/newrelic-continuous-automated-testing"```

 The function takes the following parameters:

 - ```apiKey```: A New Relic API key.
 - ```config```: A JSON CAT configuration file.  See an example [here](#example-configuration-file).


## Example Configuration file
>Configuration settings are always optional, see [Configuration Options](#configuration-options) for details about their usage.

```
{
    "accountId": 12345,
    "region": "US",
    "verbose": true,
    "tests": [
        {
            "monitorGuid": "<monitor-guid-1>"
        },
        {
            "monitorGuid": "<monitor-guid-2>",
            "config": {
                "isBlocking": false,
                "overrides": {
                    "location": "AWS_US_EAST_1",
                    "domain": {
                        "domain": "https://example.com",
                        "override": "https://example.org"
                    },
                    "secureCredential": {
                        "key": "apiKey1",
                        "overrideKey": "key-value-2"
                    },
                    "startingUrl": "https://example.com"
                }
            }
        }
    ],
    "config": {
        "batchName": "Example Config"
    }
}
```

## Configuration Options
> All configuration settings are optional, allowing for any level of complexity when setting up a test batch

### Monitor Options
|Name | Description |
|:-:|:-:|
|"isBlocking"|When true, a failure for this monitor will fail the Workflow.  True by default|
|"overrides"|A set of configuration options to override default monitor values|


Location
Secure credentials
Domain for API monitors
Starting URL for browser monitors
### Monitor Override Options
> Add these options to config.overrides in the JSON configuration file, see [the example JSON config](#example-configuration-file)

|Name |Example| Description |
|:-:|:-:|:-:|
|Location|"location": "AWS_US_EAST_1"|Override the location where the monitor will be executed|
|Domain|"domain": {"domain": "https://example.com" "override": "https://example.org"}|Override the domain for API monitors|
|Secure credentials|"secureCredential": {"key": "apiKey1", "overrideKey": "key-value-2"}|Override secured credentials used in the monitor's script|
|startingUrl|"startingUrl": "https://example.com"|Override the starting URL for browser monitors|


### Batch Options
>Config options that affect the entire batch.  Several batch options are set by default

|Name | Description |
|:-:|:-:|
|batchName|Name for the batch in the batch details list|
|branch|SCM branch used for the batch, may be filled in by default when empty or absent|
|commit|SCM commit sha for the batch, may be filled in by default when empty or absent|
|deepLink||
|platform||
|repository|SCM repository for the batch, may be filled in by default when empty or absent|

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

>We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.


## Contributing

We encourage your contributions to improve [Project Name]! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project. If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company, please drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License

[Project Name] is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.

>[If applicable: [Project Name] also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the third-party notices document.]