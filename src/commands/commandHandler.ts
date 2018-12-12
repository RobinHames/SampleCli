import CommandArguments from "../models/commandArguments";

export interface CommandHandler {
    run(commandArguments: CommandArguments): void;
}
