import { WebviewApi } from "vscode-webview";
import { WorkbenchHttpRequestData } from "~interfaces/workbenches/requests/WorkbenchHttpRequestData";


function createHttpRequestParameterRow(httpRequestParameters: HTMLTableElement) {
  const element = document.createElement("vscode-data-grid-row");
  element.className = "data-grid-buttons-hoverable";

  element.innerHTML = `
    <vscode-data-grid-cell grid-column="1">
      <vscode-text-field type="text" placeholder="Enter the name of this parameter..." value="username"></vscode-text-field>
    </vscode-data-grid-cell>
    
    <vscode-data-grid-cell grid-column="2">
      <vscode-text-field type="text" placeholder="Enter the value of this parameter..."></vscode-text-field>
    </vscode-data-grid-cell>

    <vscode-data-grid-cell grid-column="3" class="data-grid-buttons-cell">
      <vscode-button appearance="icon" aria-label="Delete">
        <span class="codicon codicon-trashcan"></span>
      </vscode-button>
    </vscode-data-grid-cell>
  `;

  return element;
};

export default function createHttpRequestParametersPanel(vscode: WebviewApi<unknown>, requestData: WorkbenchHttpRequestData) {
  const httpRequestParametersPanel = document.getElementById("http-request-parameters-panel") as HTMLDivElement;

  httpRequestParametersPanel.innerHTML = `
    <vscode-data-grid aria-label="Basic" class="data-grid-unfocusable data-grid-unhoverable">
      <vscode-data-grid-row row-type="header">
        <vscode-data-grid-cell cell-type="columnheader" grid-column="1">Preview</vscode-data-grid-cell>
      </vscode-data-grid-row>

      <vscode-data-grid-row class="data-grid-buttons-hoverable">
        <vscode-data-grid-cell grid-column="1">
          https://httpbin.org/basic-auth/root/password
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
    </vscode-data-grid>

    <vscode-data-grid class="http-request-parameters" aria-label="Basic" class="data-grid-unfocusable">
      <vscode-data-grid-row row-type="header" class="data-grid-buttons-header-row">
        <vscode-data-grid-cell cell-type="columnheader" grid-column="1">Parameter</vscode-data-grid-cell>
        
        <vscode-data-grid-cell cell-type="columnheader" grid-column="2">Value</vscode-data-grid-cell>

        <vscode-data-grid-cell grid-column="3" class="data-grid-buttons-cell">
          <vscode-button class="http-request-parameters-add" appearance="icon" aria-label="Add">
            <span class="codicon codicon-add"></span>
          </vscode-button>
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
    </vscode-data-grid>
  `;

  const httpRequestParameters = httpRequestParametersPanel.querySelector<HTMLTableElement>(".http-request-parameters")!;

  const httpRequestParametersAdd = httpRequestParametersPanel.querySelector<HTMLButtonElement>(".http-request-parameters-add")!;

  httpRequestParametersAdd.addEventListener("click", () => {
    httpRequestParameters.append(createHttpRequestParameterRow(httpRequestParameters));
  });
}