"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHttpResponseData = void 0;
function isHttpResponseData(responseData) {
    return responseData.request.type === "HTTP";
}
exports.isHttpResponseData = isHttpResponseData;
//# sourceMappingURL=WorkbenchResponseTypeValidations.js.map