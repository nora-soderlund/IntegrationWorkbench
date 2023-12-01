import React, { Component, useRef } from "react";
import { HttpRequestProps } from "../HttpRequest";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "../body/HttpRequestBodySwitch";
import { WorkbenchHttpBasicAuthorization, WorkbenchHttpBearerAuthorization, WorkbenchHttpNoneAuthorization, WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import HttpRequestAuthorizationSwitch from "./HttpRequestAuthorizationSwitch";

export default function HttpRequestAuthorization({ requestData }: HttpRequestProps) {
  return (
    <React.Fragment>
      <VSCodeRadioGroup value={requestData.data.authorization.type} onChange={(event) => {
        const value = (event.target as HTMLInputElement).value;

        if(value === requestData.data.authorization.type) {
          return;
        }

        switch(value) {
          case "none": {
            const authorizationData: WorkbenchHttpNoneAuthorization = {
              type: "none"
            };

            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestAuthorization",
              arguments: [ authorizationData ]
            });

            break;
          }

          case "basic": {
            const authorizationData: WorkbenchHttpBasicAuthorization = {
              type: "basic",

              username: {
                type: "raw",
                key: "username",
                value: ""
              },
              password: {
                type: "raw",
                key: "password",
                value: ""
              }
            };

            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestAuthorization",
              arguments: [ authorizationData ]
            });

            break;
          }

          case "bearer": {
            const authorizationData: WorkbenchHttpBearerAuthorization = {
              type: "bearer",

              token: {
                type: "raw",
                key: "token",
                value: ""
              }
            };

            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestAuthorization",
              arguments: [ authorizationData ]
            });

            break;
          }
        }
      }} style={{
        marginBottom: "1em"
      }}>
        <VSCodeRadio value="none">None</VSCodeRadio>
        <VSCodeRadio value="basic">Basic</VSCodeRadio>
        <VSCodeRadio value="bearer">Bearer</VSCodeRadio>
      </VSCodeRadioGroup>

      <HttpRequestAuthorizationSwitch requestData={requestData}/>
    </React.Fragment>
  );
};
