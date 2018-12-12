import * as fs from "fs";
import { Container, interfaces } from "inversify";
import * as path from "path";
import * as process from "process";
import "reflect-metadata";
import { CommandProcessor } from "../commandProcessor";
import { COMMAND_ALIASES } from "../commands/commandAliases";
import { CommandHandler } from "../commands/commandHandler";
import { HelpCommandHandler } from "../commands/helpCommandHandler";
import { InitCommandHandler } from "../commands/initCommandHandler";
import { ErrorHandler } from "../errors/errorHandler";
import { ConfigStoreGateway } from "../externalGateways/configStoreGateway";
import { FileUtilities } from "../shared/fileUtilities";
import { HelloApp } from "../shared/helloApp";
import { ProjectConfig } from "../shared/projectConfig";
import { ProjectConfigInit } from "../shared/projectConfigInit";
import { PROJECT_CONFIG_TAGS } from "../shared/projectConfigKeys";
import SERVICE_IDENTIFIER from "./identifiers";
import { Fs, Path, Process } from "./interfaces";

const container = new Container();
// external modules
container.bind<Fs>(SERVICE_IDENTIFIER.FS).toConstantValue(fs);
container.bind<Path>(SERVICE_IDENTIFIER.PATH).toConstantValue(path);
container.bind<Process>(SERVICE_IDENTIFIER.PROCESS).toConstantValue(process);

// project modules
container.bind<CommandProcessor>(SERVICE_IDENTIFIER.COMMAND_PROCESSOR)
    .to(CommandProcessor)
    .inSingletonScope();
container.bind<ConfigStoreGateway>(SERVICE_IDENTIFIER.CONFIG_STORE_GATEWAY)
    .to(ConfigStoreGateway)
    .inSingletonScope();
container.bind<ErrorHandler>(SERVICE_IDENTIFIER.ERROR_HANDLER)
    .to(ErrorHandler)
    .inSingletonScope();
container.bind<interfaces.Factory<ErrorHandler>>(SERVICE_IDENTIFIER.ERROR_HANDLER_FACTORY)
    .toAutoFactory<ErrorHandler>(SERVICE_IDENTIFIER.ERROR_HANDLER);
container.bind<FileUtilities>(SERVICE_IDENTIFIER.FILE_UTILITIES)
    .to(FileUtilities)
    .inSingletonScope();
container.bind<HelloApp>(SERVICE_IDENTIFIER.HELLO_APP)
    .to(HelloApp)
    .inSingletonScope();
container.bind<ProjectConfig>(SERVICE_IDENTIFIER.PROJECT_CONFIG)
    .to(ProjectConfigInit)
    .inSingletonScope()
    .whenTargetNamed(PROJECT_CONFIG_TAGS.PROJECT_CONFIG_INIT);
container.bind<ProjectConfig>(SERVICE_IDENTIFIER.PROJECT_CONFIG)
    .to(ProjectConfig)
    .inSingletonScope()
    .whenTargetIsDefault();

// Command Handlers
COMMAND_ALIASES.INIT.forEach((name) => {
    container.bind<CommandHandler>(SERVICE_IDENTIFIER.COMMAND_HANDLER)
    .to(InitCommandHandler)
    .inSingletonScope()
    .whenTargetNamed(name);
});
COMMAND_ALIASES.HELP.forEach((name) => {
    container.bind<CommandHandler>(SERVICE_IDENTIFIER.COMMAND_HANDLER)
    .to(HelpCommandHandler)
    .inSingletonScope()
    .whenTargetNamed(name);
});

// Command Handler Factory
container.bind<interfaces.Factory<CommandHandler>>(SERVICE_IDENTIFIER.COMMAND_HANDLER_FACTORY)
    .toFactory<CommandHandler>((context) => {
        return (named: string) => {
            return context.container.getNamed<CommandHandler>(SERVICE_IDENTIFIER.COMMAND_HANDLER, named);
        };
    });

export { container };
