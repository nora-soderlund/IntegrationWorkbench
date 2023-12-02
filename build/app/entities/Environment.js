"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const EnvironmentWebviewPanel_1 = require("../views/webviews/environments/EnvironmentWebviewPanel");
const Scripts_1 = __importDefault(require("../Scripts"));
class Environment {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = JSON.parse((0, fs_1.readFileSync)(this.filePath, {
            encoding: "utf-8"
        }));
    }
    save() {
        (0, fs_1.writeFileSync)(this.filePath, JSON.stringify(this.data, undefined, 2), {
            encoding: "utf-8"
        });
    }
    getParsedVariables(abortController) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const abortListener = () => reject("Aborted.");
                abortController.signal.addEventListener("abort", abortListener);
                const variables = [];
                for (let header of this.data.variables) {
                    try {
                        const value = yield Scripts_1.default.evaluateUserInput(header);
                        variables.push({
                            key: header.key,
                            value
                        });
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                abortController.signal.removeEventListener("abort", abortListener);
                resolve(variables);
            }));
        });
    }
    delete() {
        (0, fs_1.rmSync)(this.filePath);
    }
    showWebviewPanel(context) {
        if (!this.requestWebviewPanel) {
            this.requestWebviewPanel = new EnvironmentWebviewPanel_1.EnvironmentWebviewPanel(context, this);
        }
        else {
            this.requestWebviewPanel.reveal();
        }
        //commands.executeCommand("integrationWorkbench.openEnvironment", this);
    }
    deleteWebviewPanel() {
        delete this.requestWebviewPanel;
    }
    disposeWebviewPanel() {
        var _a;
        (_a = this.requestWebviewPanel) === null || _a === void 0 ? void 0 : _a.dispose();
    }
}
exports.default = Environment;
//# sourceMappingURL=Environment.js.map