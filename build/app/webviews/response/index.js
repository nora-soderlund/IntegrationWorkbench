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
const WorkbenchResponseTypeValidations_1 = require("../../../src/interfaces/workbenches/responses/utils/WorkbenchResponseTypeValidations");
const SetThemeColorVariables_1 = __importDefault(require("../theme/SetThemeColorVariables"));
const { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextField, vsCodeDropdown, vsCodeOption, vsCodePanels, vsCodePanelTab, vsCodePanelView, vsCodeBadge, vsCodeDataGrid, vsCodeDataGridRow, vsCodeDataGridCell } = require("@vscode/webview-ui-toolkit");
const shiki = require('shiki');
provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanels(), vsCodePanelTab(), vsCodePanelView(), vsCodeBadge(), vsCodeDataGrid(), vsCodeDataGridRow(), vsCodeDataGridCell());
const vscode = acquireVsCodeApi();
window.addEventListener("load", main);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = document.getElementById("response");
        (0, SetThemeColorVariables_1.default)();
        shiki.setCDN(window.shikiUri);
        const highlighter = yield shiki.getHighlighter({
            theme: 'css-variables',
            langs: ['json']
        });
        window.addEventListener('message', event => {
            var _a, _b, _c;
            const { command } = event.data;
            console.debug("Received event from extension:", command);
            switch (command) {
                case 'integrationWorkbench.showResponse': {
                    const responseData = event.data.arguments[0];
                    if (!responseData) {
                        response.innerHTML = `
            <vscode-panel-view>
              No response selected.
            </vscode-panel-view>
          `;
                    }
                    else if ((0, WorkbenchResponseTypeValidations_1.isHttpResponseData)(responseData)) {
                        switch (responseData.status) {
                            case "failed": {
                                response.innerHTML = `
                <vscode-panel-view>
                  <div class="infobox infobox-error">
                    <i class="codicon codicon-error"></i>

                    Request failed programmatically with error: ${responseData.error}
                  </div>
                </vscode-panel-view>
              `;
                                break;
                            }
                            case "done": {
                                if (responseData.result) {
                                    response.innerHTML = `
                  <vscode-panels>
                    <vscode-panel-tab id="tab-1">BODY</vscode-panel-tab>
                    <vscode-panel-tab id="tab-2">
                      HEADERS <vscode-badge id="response-headers-badge">${Object.entries(responseData.result.headers).length}</vscode-badge>
                    </vscode-panel-tab>
                    <vscode-panel-tab id="tab-3">RAW</vscode-panel-tab>
                    
                    <vscode-panel-view id="view-1">
                      <div class="response-panel http-response-parsed-body"></div>
                    </vscode-panel-view>

                    <vscode-panel-view id="view-2">
                      <div class="response-panel">
                        <vscode-data-grid aria-label="Basic">
                          <vscode-data-grid-row row-type="header">
                            <vscode-data-grid-cell cell-type="columnheader" grid-column="1">Header</vscode-data-grid-cell>
                            <vscode-data-grid-cell cell-type="columnheader" grid-column="2">Value</vscode-data-grid-cell>
                          </vscode-data-grid-row>

                          ${Object.entries(responseData.result.headers).map(([key, value]) => (`
                            <vscode-data-grid-row>
                              <vscode-data-grid-cell grid-column="1">${key}</vscode-data-grid-cell>
                              <vscode-data-grid-cell grid-column="2">${value}</vscode-data-grid-cell>
                            </vscode-data-grid-row>
                          `)).join('')}
                        </vscode-data-grid>
                      </div>
                    </vscode-panel-view>

                    <vscode-panel-view id="view-3">
                      <div class="response-panel http-response-body"></div>
                    </vscode-panel-view>
                  </vscode-panels>
                `;
                                    const httpResponseBody = response.querySelector(".http-response-body");
                                    const httpResponseParsedBody = response.querySelector(".http-response-parsed-body");
                                    if ((_a = responseData.result.body) === null || _a === void 0 ? void 0 : _a.length) {
                                        if ((_c = (_b = responseData.result.headers["content-type"]) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === null || _c === void 0 ? void 0 : _c.startsWith("application/json")) {
                                            try {
                                                const body = JSON.parse(responseData.result.body);
                                                httpResponseParsedBody.innerHTML = highlighter.codeToHtml(JSON.stringify(body, undefined, 2), { lang: 'json' });
                                            }
                                            catch (_d) {
                                                httpResponseParsedBody.innerHTML = "Bad response.";
                                            }
                                        }
                                        else {
                                            try {
                                                const body = JSON.parse(responseData.result.body);
                                                httpResponseParsedBody.innerHTML = `
                        <div class="infobox infobox-warning">
                          <i class="codicon codicon-warning"></i>

                          Response body was parsed as JSON but the Content-Type header was not <code>application/json</code>!
                        </div>

                        ${highlighter.codeToHtml(JSON.stringify(body, undefined, 2), { lang: 'json' })}
                      `;
                                            }
                                            catch (_e) {
                                                httpResponseParsedBody.innerText = responseData.result.body;
                                            }
                                        }
                                        httpResponseBody.innerHTML = highlighter.codeToHtml(responseData.result.body);
                                    }
                                    else {
                                        httpResponseParsedBody.innerHTML = `
                    <p>No response body was given.</p>
                  `;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        });
    });
}
//# sourceMappingURL=index.js.map