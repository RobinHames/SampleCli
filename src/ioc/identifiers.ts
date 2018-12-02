const SERVICE_IDENTIFIER = {
    COMMAND_HANDLER: Symbol.for("CommandHandler"),
    COMMAND_HANDLER_FACTORY: Symbol.for("Factory<CommandHandler>"),
    COMMAND_PROCESSOR: Symbol.for("CommandProcessor"),
    ERROR_HANDLER: Symbol.for("ErrorHandler"),
    ERROR_HANDLER_FACTORY: Symbol.for("ErrorHandlerFactory"),
    FILE_UTILITIES: Symbol.for("FileUtilities"),
    HELLO_APP: Symbol.for("HelloApp"),
    PROJECT_CONFIG: Symbol.for("ProjectConfig"),
};

export default SERVICE_IDENTIFIER;
