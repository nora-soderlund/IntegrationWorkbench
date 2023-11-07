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
                method: this.data.method,
                url: this.data.url,
                body: Object.assign({}, this.data.body)
            }
        };
    }
    static fromData(parent, data) {
        return new WorkbenchHttpRequest(parent, data.id, data.name, data.data);
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
    setBody(bodyData) {
        this.data.body = bodyData;
        this.parent.save();
    }
}
exports.default = WorkbenchHttpRequest;
//# sourceMappingURL=WorkbenchHttpRequest.js.map