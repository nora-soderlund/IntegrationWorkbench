import React, { Component, ReactElement, useRef } from "react";
import { HttpResponseProps } from "./HttpResponse";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { Editor } from "@monaco-editor/react";
import useMonacoUserTheme from "../../../hooks/useMonacoUserTheme";

type HttpResponseEditorBodyProps = {
  body: string;
  language: string;
  infoboxes?: {
    message: ReactElement;
    type: "warning" | "error";
  }[];
};

export default function HttpResponseEditorBody({ body, language, infoboxes }: HttpResponseEditorBodyProps) {
  const { theme } = useMonacoUserTheme();

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

      <div style={{
        flex: 1,
        height: "100%"
      }}>
        <Editor value={body} language={language} theme={theme} options={{
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
    </div>
  );
};
