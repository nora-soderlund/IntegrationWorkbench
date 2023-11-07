import React, { Component, ReactElement, useRef } from "react";
import { HttpResponseProps } from "./HttpResponse";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { Editor } from "@monaco-editor/react";

type HttpResponseEditorBodyProps = {
  body: string;
  language: string;
  infoboxes?: {
    message: ReactElement;
    type: "warning" | "error";
  }[];
};

export default function HttpResponseEditorBody({ body, language, infoboxes }: HttpResponseEditorBodyProps) {
  return (
    <div style={{
      height: "100%",
      boxSizing: "border-box",
      marginLeft: "-26px",
      width: "calc(100% + 52px)",
      display: "flex",
      flexDirection: "column"
    }}>
      {infoboxes?.map((infobox) => (
        <div className={`infobox infobox-${infobox.type}`}>
          <i className={`codicon codicon-${infobox.type}`}></i>{" "}{infobox.message}
        </div>
      ))}

      <Editor value={body} language={language} theme="vs-dark" options={{
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false
        },
        readOnly: true,
        padding: {
          top: 6,
          bottom: 6
        }
      }}/>
    </div>
  );
};
