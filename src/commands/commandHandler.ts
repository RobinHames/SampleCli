import CommandArguments from "../models/commandArguments";

export default interface CommandHandler {
    run(commandArguments: CommandArguments): void;
}
