import * as inquirer from "inquirer";
import { Question } from "inquirer";
import { inject, injectable } from "inversify";
import { ErrorHandler } from "../errors/errorHandler";
import SERVICE_IDENTIFIER from "../ioc/identifiers";
import { HelloApp } from "../shared/helloApp";
import { ProjectConfig } from "../shared/projectConfig";
import PROJECT_CONFIG_KEY from "../shared/projectConfigKeys";
import { CommandHandler } from "./commandHandler";

@injectable()
export class InitCommandHandler implements CommandHandler {

    private errorHandlerFactory: () => ErrorHandler;
    private helloApp: HelloApp;
    private projectConfig: ProjectConfig;

    public constructor(@inject(SERVICE_IDENTIFIER.ERROR_HANDLER_FACTORY) errorHandlerFactory: () => ErrorHandler,
                       @inject(SERVICE_IDENTIFIER.HELLO_APP) helloApp: HelloApp,
                       @inject(SERVICE_IDENTIFIER.PROJECT_CONFIG) projectConfig: ProjectConfig) {
        this.errorHandlerFactory = errorHandlerFactory;
        this.helloApp = helloApp;
        this.projectConfig = projectConfig.initialiseNewConfig();
    }

    public async run() {
        try {
            this.helloApp.info();
            await this.configureProjectName();
        } catch (error) {
            this.errorHandlerFactory().handle(error);
        }
    }

    private async configureProjectName() {
        const question: Question = {
            default: this.projectConfig.projectName,
            message: "What is the project name?",
            name: PROJECT_CONFIG_KEY.PROJECT_NAME,
            type: "input",
        };
        const response = await inquirer.prompt([question]);
        this.projectConfig.projectName = response[PROJECT_CONFIG_KEY.PROJECT_NAME];
    }
}
