import React, { Component, useRef } from "react";
import { HttpRequestProps } from "../HttpRequest";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { isHttpRequestApplicationJsonBodyData, isHttpRequestRawBodyData } from "../../../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import HttpRequestApplicationJsonBody from "./HttpRequestApplicationJsonBody";
import HttpRequestRawBody from "./HttpRequestRawBody";

export default function HttpRequestBodySwitch({ requestData }: HttpRequestProps) {
  if(isHttpRequestRawBodyData(requestData.data.body)) {
    return (<HttpRequestRawBody requestData={requestData} requestBodyData={requestData.data.body}/>);
  }
  else if(isHttpRequestApplicationJsonBodyData(requestData.data.body)) {
    return (<HttpRequestApplicationJsonBody requestData={requestData} requestBodyData={requestData.data.body}/>);
  }

  return (
    <React.Fragment>
      <p>This request has no body.</p>
    </React.Fragment>
  );
};
