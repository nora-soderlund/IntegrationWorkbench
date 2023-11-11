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
const WorkbenchRequestDataTypeValidations_1 = require("../../../src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations");
const WorkbenchHttpRequest_1 = __importDefault(require("../requests/WorkbenchHttpRequest"));
class WorkbenchHttpResponse {
    constructor(id, requestData, requestedAt) {
        this.id = id;
        this.requestedAt = requestedAt;
        this.status = "loading";
        this.request = WorkbenchHttpRequest_1.default.fromData(null, requestData);
        this.request.getParsedUrl().then((parsedUrl) => {
            if (!parsedUrl) {
                vscode_1.window.showErrorMessage("No URL was provided in the request.");
                return;
            }
            const headers = new Headers();
            let body;
            switch (this.request.data.authorization.type) {
                case "basic": {
                    headers.set("Authorization", `Basic ${btoa(`${this.request.data.authorization.username}:${this.request.data.authorization.password}`)}`);
                    break;
                }
                case "bearer": {
                    headers.set("Authorization", `Bearer ${this.request.data.authorization.token}`);
                    break;
                }
            }
            if ((0, WorkbenchRequestDataTypeValidations_1.isHttpRequestApplicationJsonBodyData)(this.request.data.body)) {
                headers.set("Content-Type", "application/json");
                body = this.request.data.body.body;
                this.request.data.headers.forEach((header) => {
                    headers.set(header.name, header.value);
                });
            }
            console.log(headers.get("Authorization"));
            fetch(parsedUrl, {
                method: this.request.data.method,
                headers,
                body
            })
                .then(this.handleResponse.bind(this))
                .catch(this.handleResponseError.bind(this));
        });
    }
    getData() {
        return {
            id: this.id,
            status: this.status,
            request: this.request.getData(),
            requestedAt: this.requestedAt.toISOString(),
            error: this.error,
            result: (this.response && this.result) && {
                body: this.result.body,
                headers: this.result.headers,
                status: this.response.status,
                statusText: this.response.statusText
            }
        };
    }
    handleResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            this.status = "done";
            this.response = response;
            const headers = {};
            const body = yield response.text();
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });
            this.result = {
                body,
                headers,
                status: response.status,
                statusText: response.statusText
            };
            vscode_1.commands.executeCommand("integrationWorkbench.refreshResponses", this);
        });
    }
    handleResponseError(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            this.status = "failed";
            if (reason instanceof Error) {
                this.error = reason.message;
            }
            else if (typeof reason === "string") {
                this.error = reason;
            }
            vscode_1.commands.executeCommand("integrationWorkbench.refreshResponses", this);
        });
    }
}
exports.default = WorkbenchHttpResponse;
//# sourceMappingURL=WorkbenchHttpResponse.js.map