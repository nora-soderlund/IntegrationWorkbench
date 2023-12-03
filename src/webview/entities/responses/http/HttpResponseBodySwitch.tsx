import React, { Component, useRef } from "react";
import { HttpResponseProps } from "./HttpResponse";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { Editor } from "@monaco-editor/react";
import HttpRequestApplicationJsonBody from "../../requests/http/body/HttpRequestApplicationJsonBody";
import HttpResponseApplicationJsonBody from "./HttpResponseEditorBody";
import HttpResponseEditorBody from "./HttpResponseEditorBody";

export default function HttpResponseBodySwitch({ requestData, handlerState }: HttpResponseProps) {
  if(handlerState.status !== "fulfilled") {
    return (
      <p>No response result available yet.</p>
    );
  }

  if(handlerState.data.body) {
    if(handlerState.data.headers["content-type"]?.toLowerCase()?.startsWith("application/json")) {
      if(handlerState.data?.body) {
        try {
          const parsedJson = JSON.parse(handlerState.data.body);

          return (
            <React.Fragment>
              <HttpResponseEditorBody body={JSON.stringify(parsedJson, undefined, 2)} language="json"/>
            </React.Fragment>
          );
        }
        catch {
          return (
            <HttpResponseEditorBody body={handlerState.data.body} language="json" infoboxes={[
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
    else {
      return (
        <HttpResponseEditorBody body={handlerState.data.body} language="automatic"/>
      );
    }
  }

  return (
    <p>No response available.</p>
  );
};
