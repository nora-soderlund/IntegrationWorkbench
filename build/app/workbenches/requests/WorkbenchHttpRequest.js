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
const vscode_1 = require("vscode");
const WorkbenchRequest_1 = __importDefault(require("./WorkbenchRequest"));
const WorkbenchHttpResponse_1 = __importDefault(require("../responses/WorkbenchHttpResponse"));
const crypto_1 = require("crypto");
const Scripts_1 = __importDefault(require("../../Scripts"));
class WorkbenchHttpRequest extends WorkbenchRequest_1.default {
    constructor(parent, id, name, data) {
        super(parent, id, name);
        this.data = data;
    }
    getData() {
        return {
            id: this.id,
            name: this.name,
            type: "HTTP",
            data: {
                authorization: Object.assign({}, this.data.authorization),
                method: this.data.method,
                url: this.data.url,
                headers: [...this.data.headers],
                parameters: [...this.data.parameters],
                parametersAutoRefresh: this.data.parametersAutoRefresh,
                body: Object.assign({}, this.data.body)
            }
        };
    }
    static fromData(parent, data) {
        return new WorkbenchHttpRequest(parent, data.id, data.name, data.data);
    }
    getParsedUrl(abortController) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!this.data.url) {
                    reject("Request URL is falsey.");
                    return;
                }
                const abortListener = () => reject("Aborted.");
                abortController.signal.addEventListener("abort", abortListener);
                const keys = [];
                this.data.url.replace(/\{(.+?)\}/g, (_match, key) => {
                    keys.push(key);
                    return _match;
                });
                const uniqueKeys = [...new Set(keys)];
                let parsedUrl = this.data.url;
                for (let key of uniqueKeys) {
                    const parameter = this.data.parameters.find((parameter) => parameter.key === key);
                    if (!parameter) {
                        continue;
                    }
                    const value = yield Scripts_1.default.evaluateUserInput(parameter);
                    parsedUrl = parsedUrl === null || parsedUrl === void 0 ? void 0 : parsedUrl.replace('{' + key + '}', value);
                }
                abortController.signal.removeEventListener("abort", abortListener);
                resolve(parsedUrl);
            }));
        });
    }
    send() {
        vscode_1.commands.executeCommand("integrationWorkbench.addResponse", new WorkbenchHttpResponse_1.default((0, crypto_1.randomUUID)(), this.getData(), new Date()));
    }
    setMethod(method) {
        var _a, _b;
        this.data.method = method;
        (_a = this.treeDataViewItem) === null || _a === void 0 ? void 0 : _a.setIconPath();
        vscode_1.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
        (_b = this.parent) === null || _b === void 0 ? void 0 : _b.save();
    }
    setUrl(url) {
        var _a;
        this.data.url = url;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.save();
    }
    setAuthorization(authorizationData) {
        var _a;
        this.data.authorization = authorizationData;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.save();
    }
    setBody(bodyData) {
        var _a;
        this.data.body = bodyData;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.save();
    }
    setHeaders(headers) {
        var _a;
        this.data.headers = headers;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.save();
    }
    setParameters(parameters) {
        var _a;
        this.data.parameters = parameters;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.save();
    }
}
exports.default = WorkbenchHttpRequest;
//# sourceMappingURL=WorkbenchHttpRequest.js.map