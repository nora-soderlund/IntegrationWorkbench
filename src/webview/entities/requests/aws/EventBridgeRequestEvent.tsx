import React from "react";
import { EventBridgeRequestProps } from "./EventBridgeRequest";
import Input from "../../../components/inputs/Input";
import { VSCodeButton, VSCodeDivider, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import ValueList from "../../../components/ValueList";
import { TextFieldType } from "@vscode/webview-ui-toolkit";
import useDynamicChangeHandler from "../../../hooks/useDynamicChangeHandler";

export default function EventBridgeRequestEvent({ requestData }: EventBridgeRequestProps) {
  return (
    <div style={{
      height: "100%"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "2em"
      }}>
        <div style={{
          flex: "1 1 0"
        }}>
          <p><b>Detail type</b></p>
          <p>The detail type to use for the event.</p>
  
          <Input
            type={requestData.data.detailType.type}
            value={requestData.data.detailType.value}
            maxHeight={"8em"}
            onChange={(value) => {
              requestData.data.detailType.value = value;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }} onChangeType={(type) => {
              requestData.data.detailType.type = type;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }}/>
        </div>

        <div style={{
          flex: "1 1 0"
        }}>
          <p><b>Event source</b></p>
          <p>The event source to use for the event.</p>
  
          <Input
            type={requestData.data.eventSource.type}
            value={requestData.data.eventSource.value}
            maxHeight={"8em"}
            onChange={(value) => {
              requestData.data.eventSource.value = value;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }} onChangeType={(type) => {
              requestData.data.eventSource.type = type;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }}/>
        </div>
      </div>

      <VSCodeDivider style={{
        margin: "1.5em 0"
      }}/>

      <div>
        <p><b>Resources</b> (optional)</p>
        <p>Enter the ARNs to resources associated with the event.</p>

        {(!requestData.data.resources.length)?(
          <p>This request has no resources, <VSCodeLink onClick={() => {
            requestData.data.resources.push({
              key: "",
              value: "",
              type: "raw"
            });

            window.vscode.postMessage({
              command: "norasoderlund.integrationworkbench.changeRequestData",
              arguments: [ requestData ]
            });
          }}>click here</VSCodeLink> to add one.</p>
        ):(
          <ValueList
            items={requestData.data.resources} 
            onAdd={() => {
              requestData.data.resources.push({
                key: "",
                value: "",
                type: "raw"
              });

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }}
            onChange={() => (
              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              })
            )}
            onDelete={(item) => {
              const index = requestData.data.resources.indexOf(item);
  
              requestData.data.resources.splice(index, 1);
  
              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }}/>
        )}
      </div>

      <VSCodeDivider style={{
        margin: "1.5em 0"
      }}/>

      <div>
        <p><b>Time</b> (optional)</p>
        <p>The timestamp to use for the event. If you do not provide a timestamp, the event uses the current timestamp.</p>

        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1em"
        }}>
          <div style={{
            flex: "1 1 0",

            display: "flex",
            flexDirection: "column",
            gap: "0.5em"
          }}>
            <VSCodeTextField type={"date" as TextFieldType} value={requestData.data.time.date} placeholder="Select a date..." style={{
              width: "100%"
            }} onChange={(event) => {
              requestData.data.time.date = (event.target as HTMLInputElement).value;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }}/>

            <small>Date</small>
          </div>

          <div style={{
            flex: "1 1 0",

            display: "flex",
            flexDirection: "column",
            gap: "0.5em"
          }}>
            <VSCodeTextField type={"text"} value={requestData.data.time.time} placeholder="Enter a time..." style={{
              width: "100%"
            }} onChange={(event) => {
              requestData.data.time.time = (event.target as HTMLInputElement).value;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }}/>

            <small>Use 24-hour time format (hh:mm:ss)</small>
          </div>

          <div style={{
            flex: "1 1 0",

            display: "flex",
            flexDirection: "column",
            gap: "0.5em"
          }}>
            <VSCodeDropdown style={{
              width: "100%"
            }} value={requestData.data.time.timezone} onChange={(event) => {
              requestData.data.time.timezone = (event.target as HTMLInputElement).value as ("local" | "utc");

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }}>
              <VSCodeOption value="local">Local time zone</VSCodeOption>
              <VSCodeOption value="utc">UTC</VSCodeOption>
            </VSCodeDropdown>

            <small>Time zone</small>
          </div>

          <div>
            <VSCodeButton appearance="icon" aria-label="Delete" onClick={() => {
              requestData.data.time = {
                date: "",
                time: "",
                timezone: "local"
              };

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeRequestData",
                arguments: [ requestData ]
              });
            }}>
              <span className="codicon codicon-trashcan"/>
            </VSCodeButton>
          </div>
        </div>
      </div>
    </div>
  );
};
