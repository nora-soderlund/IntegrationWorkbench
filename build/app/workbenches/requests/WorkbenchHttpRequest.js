"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const WorkbenchRequest_1 = __importDefault(require("./WorkbenchRequest"));
const WorkbenchHttpResponse_1 = __importDefault(require("../responses/WorkbenchHttpResponse"));
const crypto_1 = require("crypto");
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
                body: Object.assign({}, this.data.body)
            }
        };
    }
    static fromData(parent, data) {
        return new WorkbenchHttpRequest(parent, data.id, data.name, data.data);
    }
    getParsedUrl() {
        var _a;
        const parsedUrl = (_a = this.data.url) === null || _a === void 0 ? void 0 : _a.replace(/\{(.+?)\}/g, (_match, key) => {
            const parameter = this.data.parameters.find((parameter) => parameter.name === key);
            if (parameter) {
                return parameter.value;
            }
            return '{' + key + '}';
        });
        if (!parsedUrl) {
            return undefined;
        }
        return parsedUrl;
    }
    send() {
        vscode_1.commands.executeCommand("integrationWorkbench.addResponse", new WorkbenchHttpResponse_1.default((0, crypto_1.randomUUID)(), this.getData(), new Date()));
    }
    setMethod(method) {
        var _a;
        this.data.method = method;
        (_a = this.treeDataViewItem) === null || _a === void 0 ? void 0 : _a.setIconPath();
        vscode_1.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
        this.parent.save();
    }
    setUrl(url) {
        this.data.url = url;
        this.parent.save();
    }
    setAuthorization(authorizationData) {
        this.data.authorization = authorizationData;
        this.parent.save();
    }
    setBody(bodyData) {
        this.data.body = bodyData;
        this.parent.save();
    }
    setHeaders(headers) {
        this.data.headers = headers;
        this.parent.save();
    }
    setParameters(parameters) {
        this.data.parameters = parameters;
        this.parent.save();
    }
}
exports.default = WorkbenchHttpRequest;
//# sourceMappingURL=WorkbenchHttpRequest.js.map