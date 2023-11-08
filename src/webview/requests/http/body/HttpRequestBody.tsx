import React, { Component, useRef } from "react";
import { HttpRequestProps } from "./HttpRequest";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "./HttpRequestBodySwitch";
import { WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";

export default function HttpRequestBody({ requestData }: HttpRequestProps) {
  return (
    <React.Fragment>
      <VSCodeRadioGroup value={requestData.data.body.type} onChange={(event) => {
        const value = (event.target as HTMLInputElement).value;

        if(value === requestData.data.body.type) {
          return;
        }

        switch(value) {
          case "none": {
            const requestBodyData: WorkbenchHttpRequestNoneBodyData = {
              type: "none"
            };

            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestBody",
              arguments: [ requestBodyData ]
            });

            break;
          }

          case "raw": {
            const requestBodyData: WorkbenchHttpRequestRawBodyData = {
              type: "raw",
              body: "Hello world!"
            };

            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestBody",
              arguments: [ requestBodyData ]
            });

            break;
          }

          case "application/json": {
            const requestBodyData: WorkbenchHttpRequestApplicationJsonBodyData = {
              type: "application/json",
              body: JSON.stringify(
                {
                  foo: "bar"
                },
                undefined,
                2
              )
            };

            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestBody",
              arguments: [ requestBodyData ]
            });

            break;
          }
        }
      }} style={{
        marginBottom: "1em"
      }}>
        <VSCodeRadio value="none">None</VSCodeRadio>
        <VSCodeRadio value="raw">Raw</VSCodeRadio>
        <VSCodeRadio value="application/json">application/json</VSCodeRadio>
        <VSCodeRadio value="multipart/form-data">multipart/form-data</VSCodeRadio>
        <VSCodeRadio value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</VSCodeRadio>
      </VSCodeRadioGroup>

      <HttpRequestBodySwitch requestData={requestData}/>
    </React.Fragment>
  );
};
