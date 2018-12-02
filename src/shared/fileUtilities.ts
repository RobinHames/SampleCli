import * as fs from "fs";
import { injectable } from "inversify";
import * as path from "path";

@injectable()
export class FileUtilities {
    public getCurrentWorkingDirectory(): string {
        return process.cwd();
    }

    public getCurrentDirectoryBase(): string {
        return path.basename(process.cwd());
    }

    public getDirName(fPath: string): string {
        return path.dirname(fPath);
    }

    public createFolder(fPath: string) {
        if (!fs.existsSync(fPath)) {
            this.createFolder(this.getDirName(fPath));
            fs.mkdirSync(fPath);
        }
    }

    public pathExists(fPath: string): boolean {
        return fs.existsSync(fPath);
    }

    public pathJoin(...paths: string[]): string {
        return path.join(...paths);
    }
}
