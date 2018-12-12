import { Container, interfaces } from "inversify";
import "reflect-metadata";
import { CommandProcessor } from "../commandProcessor";
import { COMMAND_ALIASES } from "../commands/commandAliases";
import { CommandHandler } from "../commands/commandHandler";
import { HelpCommandHandler } from "../commands/helpCommandHandler";
import { InitCommandHandler } from "../commands/initCommandHandler";
import { ErrorHandler } from "../errors/errorHandler";
import { FileUtilities } from "../shared/fileUtilities";
import { HelloApp } from "../shared/helloApp";
import { ProjectConfig } from "../shared/projectConfig";
import SERVICE_IDENTIFIER from "./identifiers";

const container = new Container();
container.bind<CommandProcessor>(SERVICE_IDENTIFIER.COMMAND_PROCESSOR)
    .to(CommandProcessor)
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
container.bind<ProjectConfig>(SERVICE_IDENTIFIER.PROJECT_CONFIG).to(ProjectConfig).inSingletonScope();

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
