import { WorkbenchResponseData } from "../../interfaces/workbenches/responses/WorkbenchResponseData";
import { isHttpResponseData } from "../../interfaces/workbenches/responses/utils/WorkbenchResponseTypeValidations";
import setThemeColorVariables from "../theme/SetThemeColorVariables";

const { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextField, vsCodeDropdown, vsCodeOption, vsCodePanels, vsCodePanelTab, vsCodePanelView, vsCodeBadge } = require("@vscode/webview-ui-toolkit");
const shiki = require('shiki');

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanels(), vsCodePanelTab(), vsCodePanelView(), vsCodeBadge());

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
                      <div class="response-panel"></div>
                    </vscode-panel-view>

                    <vscode-panel-view id="view-2">Headers content.</vscode-panel-view>

                    <vscode-panel-view id="view-3">Raw content.</vscode-panel-view>
                  </vscode-panels>
                `;

                const responsePanel = response.querySelector(".response-panel") as HTMLDivElement;

                if(responseData.result.body) {
                  if(responseData.result.headers["Content-Type"]?.toLowerCase() === "application/json") {
                    try {
                      const body = JSON.parse(responseData.result.body);

                      responsePanel.innerHTML = highlighter.codeToHtml(JSON.stringify(body, undefined, 2), { lang: 'json' });
                    }
                    catch {
                      responsePanel.innerHTML = "Bad response.";
                    }
                  }
                  else {
                    try {
                      const body = JSON.parse(responseData.result.body);

                      responsePanel.innerHTML = `
                        <div class="infobox infobox-warning">
                          <i class="codicon codicon-warning"></i>

                          Response body was parsed as JSON but the Content-Type header was not <code>application/json</code>!
                        </div>

                        ${highlighter.codeToHtml(JSON.stringify(body, undefined, 2), { lang: 'json' })}
                      `;
                    }
                    catch {
                      responsePanel.innerText = responseData.result.body;
                    }
                  }
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
