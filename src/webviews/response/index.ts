import { WorkbenchResponseData } from "../../interfaces/workbenches/responses/WorkbenchResponseData";
import { isHttpResponseData } from "../../interfaces/workbenches/responses/utils/WorkbenchResponseTypeValidations";
import setThemeColorVariables from "../theme/SetThemeColorVariables";

const { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextField, vsCodeDropdown, vsCodeOption, vsCodePanels, vsCodePanelTab, vsCodePanelView, vsCodeBadge } = require("@vscode/webview-ui-toolkit");
const shiki = require('shiki');

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanels(), vsCodePanelTab(), vsCodePanelView(), vsCodeBadge());

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

async function main() {
  const responsePanel = document.getElementById("response-panel") as HTMLDivElement;
  const responseHeadersBadge = document.getElementById("response-headers-badge") as HTMLSpanElement;

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

        if(isHttpResponseData(responseData)) {
          if(responseData.result) {
            if(responseData.result?.body) {
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

            const headersCount = Object.entries(responseData.result.headers).length;

            responseHeadersBadge.innerText = headersCount.toString();
          }
        }

        break;
      }
    }
  });
}
