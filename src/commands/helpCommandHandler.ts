import { injectable } from "inversify";
import { CommandHandler } from "./commandHandler";

@injectable()
export class HelpCommandHandler implements CommandHandler {
    public run(): void {
        throw new Error("Method not implemented.");
    }
}
