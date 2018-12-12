import { inject, injectable } from "inversify";
import SERVICE_IDENTIFIER from "../ioc/identifiers";
import { Fs, Path, Process } from "../ioc/interfaces";

@injectable()
export class FileUtilities {
    private fs: Fs;
    private path: Path;
    private process: Process;

    public constructor(@inject(SERVICE_IDENTIFIER.FS) fs: Fs,
                       @inject(SERVICE_IDENTIFIER.PATH) path: Path,
                       @inject(SERVICE_IDENTIFIER.PROCESS) process: Process) {
        this.fs = fs;
        this.path = path;
        this.process = process;
    }

    public getCurrentWorkingDirectory(): string {
        return this.process.cwd();
    }

    public getCurrentWorkingDirectoryBaseName(): string {
        return this.path.basename(this.process.cwd());
    }

    public getDirName(p: string): string {
        return this.path.dirname(p);
    }

    public createFolder(folderPath: string) {
        if (!this.fs.existsSync(folderPath)) {
            this.createFolder(this.getDirName(folderPath));
            this.fs.mkdirSync(folderPath);
        }
    }

    public pathExists(fPath: string): boolean {
        return this.fs.existsSync(fPath);
    }

    public pathJoin(...paths: string[]): string {
        return this.path.join(...paths);
    }

    public resolve(...pathSegments: string[]): string {
        return this.path.resolve(...pathSegments);
    }
}
