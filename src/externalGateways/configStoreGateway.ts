import Configstore = require("Configstore");
import { injectable } from "inversify";

@injectable()
export class ConfigStoreGateway {
    private configstoreInstance!: Configstore;

    private get configstore(): Configstore {
        if (!this.configstoreInstance) {
            throw new Error("Error accessing uninitialised Configstore");
        }
        return this.configstoreInstance;
    }

    private set configstore(value: Configstore) {
        this.configstoreInstance = value;
    }

    public initialiseConfigstore(configPath: string, id?: string): void {
        this.configstore = new Configstore(id || "", null, { configPath });
    }

    public get isOpen(): boolean {
        return (this.configstoreInstance !== null);
    }

    public get path(): string {
        return this.configstore.path;
    }

    public get(key: string): any {
        return this.configstore.get(key);
    }

    public set(key: string, val: any): void {
        this.configstore.set(key, val);
    }
}
