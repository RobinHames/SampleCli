import chalk from "chalk";
import figlet from "figlet";
import { injectable } from "inversify";

@injectable()
export class HelloApp {
    public info(): void {
        console.log(
            chalk.green(
                figlet.textSync("SCLI", {
                    font: "Ghost",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                }),
            ),
        );
    }
}
