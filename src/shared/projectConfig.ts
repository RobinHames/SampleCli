import { inject, injectable } from "inversify";
import { ConfigStoreGateway } from "../externalGateways/configStoreGateway";
import SERVICE_IDENTIFIER from "../ioc/identifiers";
import { FileUtilities } from "./fileUtilities";
import { PROJECT_CONFIG_KEY } from "./projectConfigKeys";

@injectable()
export class ProjectConfig {
    protected configStoreGateway: ConfigStoreGateway;
    protected fileUtilities: FileUtilities;
    protected readonly configPackageName = "scliconfig";
    protected readonly configFileName = this.configPackageName.concat(".json");

    public constructor(@inject(SERVICE_IDENTIFIER.FILE_UTILITIES) fileUtilities: FileUtilities,
                       @inject(SERVICE_IDENTIFIER.CONFIG_STORE_GATEWAY) configStoreGateway: ConfigStoreGateway) {
        this.fileUtilities = fileUtilities;
        this.configStoreGateway = configStoreGateway;
    }

    protected openConfigstore() {
        this.openExistingConfig();
    }

    protected getConfigPathAndFileName(fPath: string): string {
        return this.fileUtilities.pathJoin(fPath, this.configFileName);
    }

    public get projectName(): string {
        return this.configStoreGateway.get(PROJECT_CONFIG_KEY.PROJECT_NAME)
            || this.fileUtilities.getCurrentWorkingDirectoryBaseName();
    }

    public set projectName(value: string) {
        this.configStoreGateway.set(PROJECT_CONFIG_KEY.PROJECT_NAME, value);
    }

    public get scriptsFolder(): string {
        return this.configStoreGateway.get(PROJECT_CONFIG_KEY.SCRIPTS_FOLDER) || this.projectName.concat("Scripts");
    }

    public set scriptsFolder(value: string) {
        this.configStoreGateway.set(PROJECT_CONFIG_KEY.SCRIPTS_FOLDER, value);
    }

    private openExistingConfig() {
        const configPath = this.findExistingconfigFile();
        this.configStoreGateway.initialiseConfigstore(configPath);
        console.log(`Using configuration from ${configPath}`);
    }

    private findExistingconfigFile(): string {
        const workingdirectory = this.fileUtilities.getCurrentWorkingDirectory();
        let configPath = workingdirectory;
        let configPathAndFileName = this.getConfigPathAndFileName(configPath);
        while (!this.fileUtilities.pathExists(configPathAndFileName)) {
            if (!configPath || configPath.length <= 4) {
                // tslint:disable-next-line:max-line-length
                throw new Error(
`Error finding the ${this.configFileName} file in the project folder structure ${workingdirectory}.
Have you run the scli init command in the project root?`);
            }
            configPath = this.fileUtilities.getDirName(configPath);
            configPathAndFileName = this.getConfigPathAndFileName(configPath);
        }
        return configPathAndFileName;
    }
}
