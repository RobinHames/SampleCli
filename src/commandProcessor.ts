import { inject, injectable } from "inversify";
import CommandHandler from "./commands/commandHandler";
import { ErrorHandler } from "./errors/errorHandler";
import SERVICE_IDENTIFIER from "./ioc/identifiers";
import CommandArguments from "./models/commandArguments";

@injectable()
export class CommandProcessor {
    private commandHandlerFactory: (command: string) => CommandHandler;
    private errorHandlerFactory: () => ErrorHandler;

    public constructor(
        @inject(SERVICE_IDENTIFIER.COMMAND_HANDLER_FACTORY) commandHandlerFactory: (command: string) => CommandHandler,
        @inject(SERVICE_IDENTIFIER.ERROR_HANDLER_FACTORY) errorHandlerFactory: () => ErrorHandler) {
            this.commandHandlerFactory = commandHandlerFactory;
            this.errorHandlerFactory = errorHandlerFactory;
        }

    public run(commandArguments: CommandArguments) {
        try {
            const commandName = commandArguments.command || (commandArguments.versionFlag ? "" : "help");
            if (commandName.length === 0) {
                return;
            }
            const commandHandler = this.commandHandlerFactory(commandName.toLowerCase().trim());
            if (commandHandler) {
                commandHandler.run(commandArguments);
            }
        } catch (error) {
            this.errorHandlerFactory().handle(error);
        }
    }
}
