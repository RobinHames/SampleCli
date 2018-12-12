// tslint:disable:object-literal-sort-keys
const SERVICE_IDENTIFIER = {
    COMMAND_HANDLER: Symbol.for("CommandHandler"),
    COMMAND_HANDLER_FACTORY: Symbol.for("Factory<CommandHandler>"),
    COMMAND_PROCESSOR: Symbol.for("CommandProcessor"),
    CONFIG_STORE_GATEWAY: Symbol.for("ConfigStoreGateway"),
    ERROR_HANDLER: Symbol.for("ErrorHandler"),
    ERROR_HANDLER_FACTORY: Symbol.for("ErrorHandlerFactory"),
    FILE_UTILITIES: Symbol.for("FileUtilities"),
    HELLO_APP: Symbol.for("HelloApp"),
    PROJECT_CONFIG: Symbol.for("ProjectConfig"),
    // External Modules
    FS: Symbol.for("Fs"),
    PATH: Symbol.for("Path"),
    PROCESS: Symbol.for("Process"),
};

export default SERVICE_IDENTIFIER;
