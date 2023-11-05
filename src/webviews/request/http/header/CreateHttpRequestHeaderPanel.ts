import { WebviewApi } from "vscode-webview";
import { WorkbenchHttpRequestData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";

export default function createHttpRequestHeaderPanel(vscode: WebviewApi<unknown>, requestData: WorkbenchHttpRequestData) {
  const httpRequestUrlInput = document.getElementById("http-request-url-input") as HTMLInputElement;
  httpRequestUrlInput.value = requestData.data.url ?? "";
  httpRequestUrlInput.addEventListener("change", () => {
    requestData.data.url = httpRequestUrlInput.value;

    vscode.postMessage({
      command: "integrationWorkbench.changeHttpRequestUrl",
      arguments: [
        requestData.data.url
      ]
    });
  });

  const httpRequestMethodDropdown = document.getElementById("http-request-method-dropdown") as HTMLSelectElement;
  httpRequestMethodDropdown.value = requestData.data.method;
  httpRequestMethodDropdown.addEventListener("change", () => {
    requestData.data.method = httpRequestMethodDropdown.value;

    vscode.postMessage({
      command: "integrationWorkbench.changeHttpRequestMethod",
      arguments: [
        requestData.data.method
      ]
    });
  });

  const httpRequestSendButton = document.getElementById("http-request-send-button") as HTMLButtonElement;
  httpRequestSendButton.addEventListener("click", () => {
    vscode.postMessage({
      command: "integrationWorkbench.sendHttpRequest",
      arguments: []
    });
  });
};
