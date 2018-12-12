#!/usr/bin/env node

import { CommandProcessor } from "./commandProcessor";
import SERVICE_IDENTIFIER from "./ioc/identifiers";
import { container } from "./ioc/inversify.config";
import CommandArguments from "./models/commandArguments";

// tslint:disable-next-line:no-var-requires
const argv = require("minimist")(process.argv.slice(2));
const commandProcessor = container.get<CommandProcessor>(SERVICE_IDENTIFIER.COMMAND_PROCESSOR);
commandProcessor.run(new CommandArguments(argv));
