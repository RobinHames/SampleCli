import { expect } from "chai";
import "reflect-metadata";
import * as TypeMoq from "typemoq";
import { Fs, Path, Process } from "../ioc/interfaces";
import { FileUtilities } from "./fileUtilities";

describe.only("FileUtilities", () => {
    let fsMock: TypeMoq.IMock<Fs>;
    let pathMock: TypeMoq.IMock<Path>;
    let processMock: TypeMoq.IMock<Process>;
    let fileUtilities: FileUtilities;

    beforeEach(() => {
        fsMock = TypeMoq.Mock.ofType<Fs>(undefined, TypeMoq.MockBehavior.Strict);
        pathMock = TypeMoq.Mock.ofType<Path>(undefined, TypeMoq.MockBehavior.Strict);
        processMock = TypeMoq.Mock.ofType<Process>(undefined, TypeMoq.MockBehavior.Strict);
        fileUtilities = new FileUtilities(fsMock.object, pathMock.object, processMock.object);
    });

    describe("getCurrentWorkingDirectory", () => {
        it("calls process.cwd", () => {
            const cwdValue = "this/folder";
            processMock
                .setup((mock) => mock.cwd())
                .returns(() => cwdValue);
            const result = fileUtilities.getCurrentWorkingDirectory();
            expect(result).to.be.equal(cwdValue);
        });
    });

    describe("getCurrentWorkingDirectoryBaseName", () => {
        it("calls path.basename on result of process.cwd", () => {
            const cwdValue = "this/foldername";
            const basenameValue = "foldername";
            processMock
                .setup((process) => process.cwd())
                .returns(() => cwdValue);
            pathMock
                .setup((path) => path.basename(TypeMoq.It.isValue(cwdValue)))
                .returns(() => basenameValue);
            const result = fileUtilities.getCurrentWorkingDirectoryBaseName();
            expect(result).to.be.equal(basenameValue);
        });
    });

    describe("getDirName", () => {
        it("calls path.dirname", () => {
            const pathValue = "this/folder/child";
            const dirnameValue = "this/folder";
            pathMock
                .setup((path) => path.dirname(TypeMoq.It.isValue(pathValue)))
                .returns(() => dirnameValue);
            const result = fileUtilities.getDirName(pathValue);
            expect(result).to.be.equal(dirnameValue);
        });
    });

    describe("createFolder", () => {
        const childFolder = "this/folder/to/create";

        it("does nothing if folder exists", () => {
            fsMock
                .setup((fs) => fs.existsSync(TypeMoq.It.isValue(childFolder)))
                .returns(() => true);
            fileUtilities.createFolder(childFolder);
        });

        // tslint:disable-next-line:max-line-length
        it("recurses back down folder hierarchy until it finds a folder that exists and then creates each folder to last child", () => {
            const parentFolder = "this/folder/to";
            const existingFolder = "this/folder";

            // child folder does not exist
            fsMock
                .setup((fs) => fs.existsSync(TypeMoq.It.isValue(childFolder)))
                .returns(() => false);
            // get parent folder
            pathMock
                .setup((path) => path.dirname(TypeMoq.It.isValue(childFolder)))
                .returns(() => parentFolder);
            // parent folder does not exist
            fsMock
                .setup((fs) => fs.existsSync(TypeMoq.It.isValue(parentFolder)))
                .returns(() => false);
            // get grandparent folder
            pathMock
                .setup((path) => path.dirname(TypeMoq.It.isValue(parentFolder)))
                .returns(() => existingFolder);
            // grand parent folder does exist
            fsMock
                .setup((fs) => fs.existsSync(TypeMoq.It.isValue(existingFolder)))
                .returns(() => true);
            // make parent folder
            fsMock.setup((fs) => fs.mkdirSync(TypeMoq.It.isValue(parentFolder)));
            // make child folder
            fsMock.setup((fs) => fs.mkdirSync(TypeMoq.It.isValue(childFolder)));

            fileUtilities.createFolder(childFolder);
        });
    });

    describe("pathExists", () => {
        it("calls fs.existsSync", () => {
            const pathValue = "this/folder";
            fsMock
                .setup((fs) => fs.existsSync(TypeMoq.It.isValue(pathValue)))
                .returns(() => true);
            const result = fileUtilities.pathExists(pathValue);
            expect(result).to.be.equal(true);
        });
    });
});
