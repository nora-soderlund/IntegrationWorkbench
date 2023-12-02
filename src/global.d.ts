import { ColorThemeKind } from "vscode";
import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import type * as monaco from "monaco-editor";
import { WebviewApi } from "vscode-webview";

declare global {
  interface Window {
    type: "request" | "response" | "environment";
    vscode: WebviewApi<unknown>;
  }
}

export {};
