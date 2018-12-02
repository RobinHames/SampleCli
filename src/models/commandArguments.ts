export default class CommandArguments {
    public command: string;
    public arguments: string[];
    public versionFlag: boolean;
    public allFlag: boolean;

    constructor(argv: any) {
        this.command = argv._[0];
        argv._.splice(0, 1);
        this.arguments = argv._;
        this.allFlag = !!(argv.a || argv.all);
        this.versionFlag = !!(argv.v || argv.version);
    }
}
