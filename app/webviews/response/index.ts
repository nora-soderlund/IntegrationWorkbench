import { WorkbenchResponseData } from "~interfaces/workbenches/responses/WorkbenchResponseData";
import { isHttpResponseData } from "~interfaces/workbenches/responses/utils/WorkbenchResponseTypeValidations";
import setThemeColorVariables from "../theme/SetThemeColorVariables";

const { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextField, vsCodeDropdown, vsCodeOption, vsCodePanels, vsCodePanelTab, vsCodePanelView, vsCodeBadge, vsCodeDataGrid, vsCodeDataGridRow, vsCodeDataGridCell } = require("@vscode/webview-ui-toolkit");
const shiki = require('shiki');

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanels(), vsCodePanelTab(), vsCodePanelView(), vsCodeBadge(), vsCodeDataGrid(), vsCodeDataGridRow(), vsCodeDataGridCell());

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

async function main() {
  const response = document.getElementById("response") as HTMLDivElement;

  setThemeColorVariables();

  shiki.setCDN(window.shikiUri);

  const highlighter = await shiki.getHighlighter({
    theme: 'css-variables',
    langs: ['json']
  });

  window.addEventListener('message', event => {
    const { command } = event.data;

    console.debug("Received event from extension:", command);

    switch (command) {
      case 'integrationWorkbench.showResponse': {
        const responseData: WorkbenchResponseData = event.data.arguments[0];

        if(!responseData) {
          response.innerHTML = `
            <vscode-panel-view>
              No response selected.
            </vscode-panel-view>
          `;
        }
        else if(isHttpResponseData(responseData)) {
          switch(responseData.status) {
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
              if(responseData.result) {
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

                          ${Object.entries(responseData.result.headers).map(([ key, value ]) => (`
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

                const httpResponseBody = response.querySelector(".http-response-body") as HTMLDivElement;
                const httpResponseParsedBody = response.querySelector(".http-response-parsed-body") as HTMLDivElement;

                if(responseData.result.body?.length) {
                  if(responseData.result.headers["content-type"]?.toLowerCase()?.startsWith("application/json")) {
                    try {
                      const body = JSON.parse(responseData.result.body);

                      httpResponseParsedBody.innerHTML = highlighter.codeToHtml(JSON.stringify(body, undefined, 2), { lang: 'json' });
                    }
                    catch {
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
                    catch {
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
}
