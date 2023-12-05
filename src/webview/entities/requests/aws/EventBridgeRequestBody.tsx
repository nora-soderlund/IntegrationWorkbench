import React from "react";
import { EventBridgeRequestProps } from "./EventBridgeRequest";
import Input from "../../../components/inputs/Input";

export default function EventBridgeRequestBody({ requestData }: EventBridgeRequestProps) {
  return (
    <div style={{
      height: "100%"
    }}>
      <Input rawType={"json"} type={requestData.data.body.type} value={requestData.data.body.value} onChange={(value) => {
        requestData.data.body.value = value;

        window.vscode.postMessage({
          command: "norasoderlund.integrationworkbench.changeEventBridgeBody",
          arguments: [ requestData.data.body ]
        });
      }} onChangeType={(type) => {
        requestData.data.body.type = type;

        window.vscode.postMessage({
          command: "norasoderlund.integrationworkbench.changeEventBridgeBody",
          arguments: [ requestData.data.body ]
        });
      }}/>
    </div>
  );
};
