#!/usr/bin/env node

import { CommandProcessor } from "./commandProcessor";
import { MinimistGateway } from "./externalGateways/minimistGateway";
import SERVICE_IDENTIFIER from "./ioc/identifiers";
import { container } from "./ioc/inversify.config";
import CommandArguments from "./models/commandArguments";

const argv = MinimistGateway.parseArguments(process.argv.slice(2));
const commandProcessor = container.get<CommandProcessor>(SERVICE_IDENTIFIER.COMMAND_PROCESSOR);
commandProcessor.run(new CommandArguments(argv));
