import Configstore from "Configstore";
import { inject, injectable } from "inversify";
import SERVICE_IDENTIFIER from "../ioc/identifiers";
import { FileUtilities } from "./fileUtilities";
import PROJECT_CONFIG_KEY from "./projectConfigKeys";

@injectable()
export class ProjectConfig {
    private fileUtilities: FileUtilities;
    private intConfigstore!: Configstore;
    private readonly configPackageName = "scliconfig";
    private readonly configFileName = this.configPackageName.concat(".json");

    private get configstore(): Configstore {
        if (!this.intConfigstore) {
            this.openExistingConfig();
        }
        return this.intConfigstore;
    }

    private set configstore(value: Configstore) {
        this.intConfigstore = value;
    }

    public constructor(@inject(SERVICE_IDENTIFIER.FILE_UTILITIES) fileUtilities: FileUtilities) {
        this.fileUtilities = fileUtilities;
    }

    public initialiseNewConfig(): ProjectConfig {
        const configPath = this.getConfigPathAndFileName(this.fileUtilities.getCurrentWorkingDirectory());
        this.configstore = new Configstore(this.configPackageName, null, { configPath });
        return this;
    }

    public get projectName(): string {
        return this.configstore.get(PROJECT_CONFIG_KEY.PROJECT_NAME) || this.fileUtilities.getCurrentDirectoryBase();
    }

    public set projectName(value: string) {
        this.configstore.set(PROJECT_CONFIG_KEY.PROJECT_NAME, value);
    }

    public get scriptsFolder(): string {
        return this.configstore.get(PROJECT_CONFIG_KEY.SCRIPTS_FOLDER) || this.projectName.concat("Scripts");
    }

    public set scriptsFolder(value: string) {
        this.configstore.set(PROJECT_CONFIG_KEY.SCRIPTS_FOLDER, value);
    }

    private openExistingConfig() {
        const configPath = this.findExistingconfigFile();
        this.configstore = new Configstore(this.configPackageName, null, { configPath });
    }

    private findExistingconfigFile(): string {
        const workingdirectory = this.fileUtilities.getCurrentWorkingDirectory();
        let configPath = workingdirectory;
        let configPathAndFileName = this.getConfigPathAndFileName(configPath);
        while (!this.fileUtilities.pathExists(configPathAndFileName)) {
            if (!configPath || configPath.length <= 4) {
                // tslint:disable-next-line:max-line-length
                throw new Error(`Error finding the ${this.configFileName} file in the project folder structure ${workingdirectory}.
    Have you run the scli init command in the project root?`);
            }
            configPath = this.fileUtilities.getDirName(configPath);
            configPathAndFileName = this.getConfigPathAndFileName(configPath);
        }
        return configPathAndFileName;
    }

    private getConfigPathAndFileName(fPath: string): string {
        return this.fileUtilities.pathJoin(fPath, this.configFileName);
    }
}
