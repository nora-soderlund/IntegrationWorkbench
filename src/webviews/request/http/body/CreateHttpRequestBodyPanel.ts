import type * as monaco from "monaco-editor";
import { WorkbenchRequestData } from "../../../../interfaces/workbenches/requests/WorkbenchRequestData";
import { isHttpRequestApplicationJsonBodyData } from "../../../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { WebviewApi } from "vscode-webview";

export default function createHttpRequestBodyPanel(vscode: WebviewApi<unknown>, requestData: WorkbenchRequestData) {
  const httpRequestBody = document.getElementById("http-request-body") as HTMLDivElement;

  const requestView = document.getElementById("request-view")!;

  const currentHttpRequestBodyRadio = requestView.querySelector<HTMLInputElement>(`vscode-radio[value="${requestData.data.body.type}"]`);
  currentHttpRequestBodyRadio!.checked = true;
  

  switch(requestData.data.body.type) {
    case "none": {
      httpRequestBody.innerHTML = `
        <p>This request has no body.</p>
      `;

      break;
    }

    case "raw": {
      httpRequestBody.innerHTML = `
        <p>Raw.</p>
      `;

      break;
    }

    case "application/json": {
        // <vscode-text-area class="http-request-body-code" resize="none" rows="10"></vscode-text-area>

      httpRequestBody.innerHTML = `
        <div class="http-request-body-code">
          <div class="http-request-body-code-monaco"></div>
        </div>
      `;

      const httpRequestBodyCode = httpRequestBody.querySelector(".http-request-body-code-monaco") as HTMLDivElement;

      //@ts-ignore
      require(['vs/editor/editor.main'], () => {
        if(isHttpRequestApplicationJsonBodyData(requestData.data.body)) {
          //@ts-ignore
          const editor = monaco.editor.create(httpRequestBodyCode, {
            value: requestData.data.body.body,
            language: 'json',
            theme: "vs-dark",
            wordWrap: "bounded",
            minimap: {
              enabled: false
            },
            scrollBeyondLastLine: false
          });

          editor.getModel()!.onDidChangeContent((event) => {
            requestData.data.body = {
              type: "application/json",
              body: editor.getValue()
            };

            vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestBody",
              arguments: [
                requestData.data.body
              ]
            });
          });
        }
      });

      //httpRequestBodyCode.value = requestData.data.body.body;

      break;
    }

    default: {
      httpRequestBody.innerHTML = "";

      break;
    }
  }
}