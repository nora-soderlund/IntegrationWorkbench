import { ColorThemeKind } from "vscode";
import { WorkbenchRequestData } from "../interfaces/workbenches/requests/WorkbenchRequestData";

declare global {
  interface Window {
    shikiUri: string;
    activeColorThemeKind: ColorThemeKind;
    workbenchRequest: WorkbenchRequestData;
  }
}

export {};
