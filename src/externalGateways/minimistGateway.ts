export abstract class MinimistGateway {
    public static parseArguments(args: string[]): any {
        return require("minimist")(args);
    }
}
