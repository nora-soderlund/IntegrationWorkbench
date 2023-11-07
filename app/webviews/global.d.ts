import { ColorThemeKind } from "vscode";
import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import type * as monaco from "monaco-editor";

declare global {
  interface Window {
    shikiUri: string;
    activeColorThemeKind: ColorThemeKind;
    workbenchRequest: WorkbenchRequestData;
  }
}

export {};
