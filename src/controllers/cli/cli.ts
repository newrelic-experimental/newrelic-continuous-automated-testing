#! /usr/bin/env node
import { Command } from "commander";
import { runTestsCommand } from "./commands/run-tests";

const program = new Command();
program
  .name("newrelic-cat")
  .version("0.1.0")
  .description("CLI for running New Relic Synthetics tests in CICD Pipelines");

program.addCommand(runTestsCommand);

async function main() {
  await program.parseAsync();
}

main();
