import setThemeColorVariables from "../theme/SetThemeColorVariables";

const { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextField, vsCodeDropdown, vsCodeOption, vsCodePanels, vsCodePanelTab, vsCodePanelView } = require("@vscode/webview-ui-toolkit");
const shiki = require('shiki');

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanels(), vsCodePanelTab(), vsCodePanelView());

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  const codeElement = document.getElementById("response");

  setThemeColorVariables();

  shiki.setCDN(window.shikiUri);

  shiki.getHighlighter({
    theme: 'css-variables',
    langs: ['json']
  }).then((highlighter: any) => {
    const result = {
      message: "hello world"
    };
    
    const codeHtml = highlighter.codeToHtml(JSON.stringify(result, undefined, 2), { lang: 'json' });

    codeElement!.innerHTML = codeHtml;
  });
}
