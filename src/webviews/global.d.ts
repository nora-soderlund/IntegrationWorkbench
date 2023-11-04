import { ColorThemeKind } from "vscode";

declare global {
  interface Window {
    shikiUri: string;
    activeColorThemeKind: ColorThemeKind;
  }
}

export {};
