#!/usr/bin/env node

const { parseArgs } = require("./cli/parse");
const { ntg } = require("./cli/ntg");

ntg(parseArgs(process.argv));
