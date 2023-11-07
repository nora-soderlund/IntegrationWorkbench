import React, { Component, useRef } from "react";
import { HttpResponseProps } from "./HttpResponse";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { Editor } from "@monaco-editor/react";
import HttpRequestApplicationJsonBody from "../../requests/http/HttpRequestApplicationJsonBody";
import HttpResponseApplicationJsonBody from "./HttpResponseEditorBody";
import HttpResponseEditorBody from "./HttpResponseEditorBody";

export default function HttpResponseBodySwitch({ responseData }: HttpResponseProps) {
  if(!responseData.result) {
    return (
      <p>No response result available yet.</p>
    );
  }

  if(responseData.result.headers["content-type"].toLowerCase() === "application/json") {
    if(responseData.result?.body) {
      try {
        const parsedJson = JSON.parse(responseData.result.body + "--");

        return (
          <React.Fragment>
            <HttpResponseEditorBody body={JSON.stringify(parsedJson, undefined, 4)} language="json"/>
          </React.Fragment>
        );
      }
      catch {
        return (
          <HttpResponseEditorBody body={responseData.result.body} language="json" infoboxes={[
            {
              type: "warning",
              message: (
                <React.Fragment>
                  Response body was parsed as JSON but the Content-Type header was not <code>application/json</code>!
                </React.Fragment>
              )
            }
          ]}/>
        );
      }
    }
  }

  return (
    <p>No response available.</p>
  );
};
