import chalk from "chalk";
import { injectable } from "inversify";

@injectable()
export class ErrorHandler {
    public handle(error: any): void {
        if (error instanceof Error) {
            console.log(chalk.white(chalk.bgRed("Error:"), (error as Error).message));
            return;
        }
        console.log(error);
    }
}
