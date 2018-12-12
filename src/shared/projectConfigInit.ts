import { inject, injectable } from "inversify";
import { ConfigStoreGateway } from "../externalGateways/configStoreGateway";
import SERVICE_IDENTIFIER from "../ioc/identifiers";
import { FileUtilities } from "./fileUtilities";
import { ProjectConfig } from "./projectConfig";

@injectable()
export class ProjectConfigInit extends ProjectConfig {
    public constructor(@inject(SERVICE_IDENTIFIER.FILE_UTILITIES) fileUtilities: FileUtilities,
                       @inject(SERVICE_IDENTIFIER.CONFIG_STORE_GATEWAY) configStoreGateway: ConfigStoreGateway) {
        super(fileUtilities, configStoreGateway);
    }

    protected openConfigstore() {
        this.initialiseNewConfig();
    }

    private initialiseNewConfig() {
        const configPath = this.getConfigPathAndFileName(this.fileUtilities.getCurrentWorkingDirectory());
        this.configStoreGateway.initialiseConfigstore(configPath);
    }
}
